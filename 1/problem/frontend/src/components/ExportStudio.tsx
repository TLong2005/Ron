import { useState } from 'react'
import type { ExportFormat } from '../types/export'
import { Pipeline } from './Pipeline'

const DATASET = { label: 'Orders', sizeMb: 500 }

const FORMATS: { id: ExportFormat; label: string; ext: string }[] = [
  { id: 'csv', label: 'CSV', ext: '.csv' },
  { id: 'xlsx', label: 'Excel', ext: '.xlsx' },
  { id: 'json', label: 'JSON', ext: '.json' },
]

interface ExportStudioProps {
  notice: string | null
  busy: boolean
  onDismissNotice: () => void
  onExport: (format: ExportFormat) => void
  onDownload: () => void
}

export function ExportStudio({
  notice,
  busy,
  onDismissNotice,
  onExport,
  onDownload,
}: ExportStudioProps) {
  const [format, setFormat] = useState<ExportFormat>('csv')
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
                <p>Dữ liệu đơn hàng</p>
              </div>
              <span className="dataset__size">~{DATASET.sizeMb}MB</span>
            </div>
          </div>

          <fieldset className="field">
            <legend className="field__label">Định dạng</legend>
            <div className="format-row" role="radiogroup" aria-label="Format">
              {FORMATS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={format === item.id}
                  className={format === item.id ? 'format is-on' : 'format'}
                  disabled={busy}
                  onClick={() => setFormat(item.id)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.ext}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="studio__actions">
            {!ready ? (
              <button
                type="button"
                className="btn btn--primary"
                disabled={busy}
                onClick={() => onExport(format)}
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
                <dd>{format.toUpperCase()}</dd>
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
