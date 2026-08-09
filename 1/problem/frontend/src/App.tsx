import { useEffect, useRef, useState } from 'react'
import { exportFile, getExportDownloadUrl, getExportStatus } from './api/file'
import { Atmosphere } from './components/Atmosphere'
import { ExportStudio } from './components/ExportStudio'
import { mapJobStateToStage, type ExportStage } from './types/export'

const POLL_MS = 1500

export default function App() {
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState<ExportStage>('idle')
  const [progress, setProgress] = useState(0)
  const [jobId, setJobId] = useState<string | null>(null)
  const pollRef = useRef<number | null>(null)

  function stopPolling() {
    if (pollRef.current != null) {
      window.clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  useEffect(() => () => stopPolling(), [])

  function startPolling(id: string) {
    stopPolling()

    const tick = async () => {
      try {
        const status = await getExportStatus(id)
        const nextStage = mapJobStateToStage(status.state)
        const nextProgress =
          typeof status.progress === 'number' && status.progress > 0
            ? status.progress
            : nextStage === 'queued'
              ? 10
              : nextStage === 'writing'
                ? 55
                : nextStage === 'ready'
                  ? 100
                  : 0

        setStage(nextStage)
        setProgress(nextProgress)
        setNotice(`Job ${id}: ${status.state}`)

        if (nextStage === 'ready' || nextStage === 'failed') {
          stopPolling()
          setBusy(false)
          if (nextStage === 'failed') {
            setNotice(status.failedReason ?? `Job ${id} thất bại`)
          } else {
            setNotice(`Export xong (job ${id}), đang tải file…`)
            window.location.href = getExportDownloadUrl(id)
          }
        }
      } catch (error) {
        stopPolling()
        setBusy(false)
        setStage('failed')
        setNotice(error instanceof Error ? error.message : 'Polling thất bại')
      }
    }

    void tick()
    pollRef.current = window.setInterval(() => void tick(), POLL_MS)
  }

  async function handleExport() {
    stopPolling()
    setBusy(true)
    setNotice(null)
    setStage('queued')
    setProgress(5)
    setJobId(null)

    try {
      const res = await exportFile()
      if (!res.jobId) {
        throw new Error('Backend không trả jobId')
      }
      setJobId(res.jobId)
      setNotice(`Đã gửi job ${res.jobId}`)
      startPolling(res.jobId)
    } catch (error) {
      setBusy(false)
      setStage('failed')
      setNotice(error instanceof Error ? error.message : 'Export thất bại')
    }
  }

  return (
    <div className="app">
      <Atmosphere />

      <header className="topbar">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true" />
          <span className="brand__name">Export</span>
        </div>
      </header>

      <main>
        <ExportStudio
          notice={notice}
          busy={busy}
          stage={stage}
          progress={progress}
          jobId={jobId}
          onDismissNotice={() => setNotice(null)}
          onExport={handleExport}
          onDownload={() => {
            if (!jobId) {
              setNotice('Chưa có job để tải')
              return
            }
            window.location.href = getExportDownloadUrl(jobId)
          }}
        />
      </main>
    </div>
  )
}
