import { useState } from 'react'
import { exportFile } from './api/file'
import { Atmosphere } from './components/Atmosphere'
import { ExportStudio } from './components/ExportStudio'
import type { ExportFormat } from './types/export'

export default function App() {
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleExport(format: ExportFormat) {
    setBusy(true)
    setNotice(null)

    try {
      await exportFile(format)
      setNotice(`Đã gửi job export ${format.toUpperCase()}`)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Export thất bại')
    } finally {
      setBusy(false)
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
          onDismissNotice={() => setNotice(null)}
          onExport={handleExport}
          onDownload={() => setNotice('API download chưa làm.')}
        />
      </main>
    </div>
  )
}
