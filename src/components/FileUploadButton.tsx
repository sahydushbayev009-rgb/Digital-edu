import React, { useRef, useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, X } from 'lucide-react';
import { validatePracticeFile } from '../utils/fileValidation';
import { useSubmissionStore } from '../store/useSubmissionStore';
import { useI18nStore } from '../store/useI18nStore';

const labels = {
  uz: {
    uploading: "Yuklanmoqda...",
    uploadFile: "Fayl yuklash",
    uploadSuccess: "Fayl muvaffaqiyatli yuklandi!",
    uploadFailed: "Yuklash muvaffaqiyatsiz. Qayta urinib ko'ring.",
    invalidFile: "Yaroqsiz fayl",
    accepted: "Qabul qilinadi: .doc, .docx (maks 10 MB)",
    ariaLabel: "Amaliyot faylini yuklash",
    dragDrop: "Faylni bu yerga tashlang yoki",
    browse: "tanlang",
    selectedFile: "Tanlangan fayl",
    removeFile: "O'chirish",
  },
  ru: {
    uploading: "Загрузка...",
    uploadFile: "Загрузить файл",
    uploadSuccess: "Файл успешно загружен!",
    uploadFailed: "Загрузка не удалась. Попробуйте снова.",
    invalidFile: "Недопустимый файл",
    accepted: "Допустимые форматы: .doc, .docx (макс. 10 МБ)",
    ariaLabel: "Загрузить файл практики",
    dragDrop: "Перетащите файл сюда или",
    browse: "выберите",
    selectedFile: "Выбранный файл",
    removeFile: "Удалить",
  },
  en: {
    uploading: "Uploading...",
    uploadFile: "Upload File",
    uploadSuccess: "File uploaded successfully!",
    uploadFailed: "Upload failed. Please try again.",
    invalidFile: "Invalid file",
    accepted: "Accepted: .doc, .docx (max 10 MB)",
    ariaLabel: "Upload practice file",
    dragDrop: "Drop file here or",
    browse: "browse",
    selectedFile: "Selected file",
    removeFile: "Remove",
  },
}

interface FileUploadButtonProps {
  contentItemId: string;
  onUploadComplete?: (result: { error: string | null }) => void;
}

export default function FileUploadButton({ contentItemId, onUploadComplete }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { language } = useI18nStore();
  const L = labels[language];

  const uploadFile = useSubmissionStore((state) => state.uploadFile);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = async (file: File) => {
    // Reset states
    setError(null);
    setSuccess(false);
    setSelectedFile(file);

    // Client-side validation
    const validation = validatePracticeFile(file);
    if (!validation.valid) {
      setError(validation.error || L.invalidFile);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Upload
    setUploading(true);
    try {
      const result = await uploadFile(file, contentItemId);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
      onUploadComplete?.(result);
    } catch {
      setError(L.uploadFailed);
      onUploadComplete?.({ error: 'Upload failed' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".doc,.docx"
        onChange={handleFileChange}
        className="hidden"
        aria-label={L.ariaLabel}
      />

      {/* Drop zone / Upload area */}
      <div
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-cyan-400/50 bg-cyan-500/10'
            : uploading
            ? 'border-white/10 bg-white/[0.02] cursor-wait'
            : 'border-white/10 bg-white/[0.02] hover:border-cyan-400/30 hover:bg-white/[0.04]'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
            <p className="text-white/50 text-sm font-medium">{L.uploading}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Upload size={22} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">
                {L.dragDrop}{' '}
                <span className="text-cyan-400 font-bold hover:text-cyan-300">{L.browse}</span>
              </p>
              <p className="text-white/25 text-xs mt-1">{L.accepted}</p>
            </div>
          </div>
        )}
      </div>

      {/* Selected file info */}
      {selectedFile && !error && !uploading && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
          <FileText size={16} className="text-indigo-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-white/30 text-xs">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>
          {!success && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20" role="alert">
          <AlertCircle size={14} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300 font-medium">{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20" role="status">
          <CheckCircle size={14} className="text-green-400 shrink-0" />
          <p className="text-sm text-green-300 font-medium">{L.uploadSuccess}</p>
        </div>
      )}
    </div>
  );
}
