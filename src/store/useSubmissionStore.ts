import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { validatePracticeFile } from '../utils/fileValidation';
import type { Submission, SubmissionWithProfile, SubmissionWithContent, GradingFilters } from '../types/submission';
import { INITIAL_FAKE_SUBMISSIONS } from '../data/fakeSubmissions';

const BUCKET_NAME = 'practice-files';
const FAKE_SUBMISSIONS_KEY = 'digitaledu_fake_submissions';

function getStoredFakeSubmissions(): SubmissionWithProfile[] {
  try {
    const raw = localStorage.getItem(FAKE_SUBMISSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_FAKE_SUBMISSIONS;
}

interface SubmissionState {
  submissions: SubmissionWithProfile[];
  mySubmissions: SubmissionWithContent[];
  loading: boolean;
  filters: GradingFilters;

  fetchAllSubmissions: () => Promise<void>;
  fetchMySubmissions: () => Promise<void>;
  setFilters: (filters: Partial<GradingFilters>) => void;
  uploadFile: (file: File, contentItemId: string) => Promise<{ error: string | null }>;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => Promise<{ error: string | null }>;
}

export const useSubmissionStore = create<SubmissionState>()((set, get) => ({
  submissions: [],
  mySubmissions: [],
  loading: false,
  filters: {
    status: 'all',
    group: '',
    contentItemId: '',
  },

  fetchAllSubmissions: async () => {
    set({ loading: true });
    try {
      let query = supabase
        .from('submissions')
        .select(`
          *,
          profiles:user_id (full_name, group_name, avatar_emoji),
          content_items:content_item_id (title, topic_id)
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Fetch submissions error:', error);
      }

      const realData = (data || []) as SubmissionWithProfile[];
      const fakeData = getStoredFakeSubmissions();

      // Haqiqiy va soxta topshiriqlarni birlashtiramiz
      let results = [...realData, ...fakeData];

      const { filters } = get();

      if (filters.status !== 'all') {
        results = results.filter((s) => s.status === filters.status);
      }
      if (filters.contentItemId) {
        results = results.filter((s) => s.content_item_id === filters.contentItemId);
      }
      if (filters.group) {
        results = results.filter(
          (s) => s.profiles?.group_name === filters.group
        );
      }

      set({ submissions: results });
    } finally {
      set({ loading: false });
    }
  },

  fetchMySubmissions: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          content_items:content_item_id (title, topic_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch my submissions error:', error);
        return;
      }

      set({ mySubmissions: (data || []) as unknown as SubmissionWithContent[] });
    } finally {
      set({ loading: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  uploadFile: async (file: File, contentItemId: string) => {
    // Validate the file
    const validation = validatePracticeFile(file);
    if (!validation.valid) {
      return { error: validation.error || 'Invalid file' };
    }

    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: 'User not authenticated' };

      const filePath = `${user.id}/${contentItemId}/${file.name}`;

      // Check if there's an existing submission for this content item
      const { data: existing } = await supabase
        .from('submissions')
        .select('id, file_path')
        .eq('user_id', user.id)
        .eq('content_item_id', contentItemId)
        .maybeSingle();

      // If existing, delete old file from storage
      if (existing?.file_path) {
        await supabase.storage.from(BUCKET_NAME).remove([existing.file_path]);
      }

      // Upload new file
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        return { error: uploadError.message };
      }

      // Upsert submission record
      if (existing) {
        const { error: updateError } = await supabase
          .from('submissions')
          .update({
            file_path: filePath,
            file_name: file.name,
            file_size: file.size,
            status: 'pending',
            score: null,
            feedback: null,
            graded_by: null,
            graded_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (updateError) {
          return { error: updateError.message };
        }
      } else {
        const { error: insertError } = await supabase
          .from('submissions')
          .insert({
            user_id: user.id,
            content_item_id: contentItemId,
            file_path: filePath,
            file_name: file.name,
            file_size: file.size,
            status: 'pending',
          });

        if (insertError) {
          return { error: insertError.message };
        }
      }

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Upload failed' };
    } finally {
      set({ loading: false });
    }
  },

  gradeSubmission: async (submissionId: string, score: number, feedback: string) => {
    set({ loading: true });
    try {
      if (submissionId.startsWith('fake-')) {
        const stored = getStoredFakeSubmissions();
        const updated = stored.map((s) =>
          s.id === submissionId
            ? {
                ...s,
                status: 'graded' as const,
                score,
                feedback: feedback || null,
                graded_by: 'guzal_teacher',
                graded_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : s
        );
        localStorage.setItem(FAKE_SUBMISSIONS_KEY, JSON.stringify(updated));
        await get().fetchAllSubmissions();
        return { error: null };
      }

      const { error } = await supabase.rpc('grade_submission', {
        p_submission_id: submissionId,
        p_score: score,
        p_feedback: feedback || null,
      });

      if (error) {
        return { error: error.message };
      }

      // Refresh submissions list after grading
      await get().fetchAllSubmissions();

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Grading failed' };
    } finally {
      set({ loading: false });
    }
  },
}));
