import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import { saveAs } from 'file-saver'
import { useI18nStore } from '../store/useI18nStore'
import type { SubmissionWithProfile } from '../types/submission'
import { generateAcademicDocxBlob } from '../utils/documentGenerator'

const labels = {
  uz: {
    exportWord: "Word faylda yuklab olish",
    exporting: "Tayyorlanmoqda...",
    exportError: "Xatolik yuz berdi",
  },
  ru: {
    exportWord: "Скачать в Word",
    exporting: "Подготовка...",
    exportError: "Произошла ошибка",
  },
  en: {
    exportWord: "Download as Word",
    exporting: "Preparing...",
    exportError: "An error occurred",
  },
}

interface WordExportButtonProps {
  submission: SubmissionWithProfile
}

export function WordExportButton({ submission }: WordExportButtonProps) {
  const { language } = useI18nStore()
  const L = labels[language]
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setExporting(true)
    setError(null)

    try {
      const studentName = submission.profiles?.full_name || "Talaba"
      const groupName = submission.profiles?.group_name || "201-guruh"
      const topicTitle = submission.content_items?.title || "Raqamli pedagogika"
      const topicId = submission.content_items?.topic_id || 1
      const date = new Date(submission.created_at).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

      // Generate the full 4-page Word document
      const blob = await generateAcademicDocxBlob(
        {
          title: topicTitle,
          studentName,
          groupName,
          date,
          topicId,
        },
        language
      )

      const safeStudentName = studentName.replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s\u0400-\u04FF\u0600-\u06FF]/g, '').replace(/\s+/g, '_')
      const safeTopic = topicTitle.substring(0, 30).replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s\u0400-\u04FF\u0600-\u06FF]/g, '').replace(/\s+/g, '_')
      const exportFileName = `Mustaqil_ish_${safeTopic}_${safeStudentName}.docx`

      saveAs(blob, exportFileName)
    } catch (err) {
      console.error('Word export error:', err)
      setError(L.exportError)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={exporting}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-bold hover:bg-green-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exporting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {L.exporting}
          </>
        ) : (
          <>
            <FileDown size={16} />
            {L.exportWord}
          </>
        )}
      </button>
      {error && (
        <p className="text-red-400/70 text-xs mt-2 text-center">{error}</p>
      )}
    </div>
  )
}
