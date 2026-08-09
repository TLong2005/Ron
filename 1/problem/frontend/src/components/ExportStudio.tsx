import { Pipeline } from './Pipeline'

const DATASET = { label: 'Orders', sizeMb: 500 }

interface ExportStudioProps {
  notice: string | null
  busy: boolean
  onDismissNotice: () => void
  onExport: () => void
  onDownload: () => void
}

export function ExportStudio({
  notice,
  busy,
  onDismissNotice,
  onExport,
  onDownload,
}: ExportStudioProps) {
  const stage = busy ? ('queued' as const) : ('idle' as const)
  const progress = 0
  const ready = false

  return (
    <section className="studio">
      <div className="studio__grid">
        <div className="studio__controls">
          <div className="field">
            <span className="field__label">Dataset</span>
            <div className="dataset">
              <div>
                <strong>{DATASET.label}</strong>
                <p>Dữ liệu đơn hàng · CSV</p>
              </div>
              <span className="dataset__size">~{DATASET.sizeMb}MB</span>
            </div>
          </div>

          <div className="studio__actions">
            {!ready ? (
              <button
                type="button"
                className="btn btn--primary"
                disabled={busy}
                onClick={onExport}
              >
                {busy ? 'Đang xử lý…' : 'Export'}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn--download"
                onClick={onDownload}
              >
                Tải file
              </button>
            )}
          </div>

          {notice && (
            <p className="toast toast--pending" role="status">
              {notice}
              <button type="button" className="toast__close" onClick={onDismissNotice}>
                Đóng
              </button>
            </p>
          )}
        </div>

        <aside className="studio__status" aria-live="polite">
          <div className="status-board">
            <div className="status-board__top">
              <div>
                <span className={busy ? 'badge badge--queued' : 'badge badge--idle'}>
                  {busy ? 'Queued' : 'Idle'}
                </span>
                <p className="status-board__msg">
                  {busy ? 'Đang gửi job…' : 'Sẵn sàng export'}
                </p>
              </div>
              <span className="status-board__pct">{progress}%</span>
            </div>

            <Pipeline stage={stage} progress={progress} />

            <dl className="meta">
              <div>
                <dt>Dataset</dt>
                <dd>{DATASET.label}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>CSV</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>~{DATASET.sizeMb}MB</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  )
}
