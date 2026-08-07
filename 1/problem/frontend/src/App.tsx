import { useState } from 'react'
import { Atmosphere } from './components/Atmosphere'
import { ExportStudio } from './components/ExportStudio'

export default function App() {
  const [notice, setNotice] = useState<string | null>(null)

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
          onDismissNotice={() => setNotice(null)}
          onExport={() => setNotice('API chưa làm.')}
          onDownload={() => setNotice('API chưa làm.')}
        />
      </main>
    </div>
  )
}
