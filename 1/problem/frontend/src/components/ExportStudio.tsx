import type { ExportStage } from '../types/export'
import { Pipeline } from './Pipeline'

const DATASET = { label: 'Orders', sizeMb: 500 }

const BADGE: Record<ExportStage, string> = {
  idle: 'Idle',
  queued: 'Queued',
  querying: 'Querying',
  writing: 'Writing',
  ready: 'Ready',
  failed: 'Failed',
}

interface ExportStudioProps {
  notice: string | null
  busy: boolean
  stage: ExportStage
  progress: number
  jobId: string | null
  onDismissNotice: () => void
  onExport: () => void
  onDownload: () => void
}

export function ExportStudio({
  notice,
  busy,
  stage,
  progress,
  jobId,
  onDismissNotice,
  onExport,
  onDownload,
}: ExportStudioProps) {
  const ready = stage === 'ready'

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
                <span className={`badge badge--${stage === 'idle' ? 'idle' : stage === 'failed' ? 'failed' : 'queued'}`}>
                  {BADGE[stage]}
                </span>
                <p className="status-board__msg">
                  {stage === 'idle' && 'Sẵn sàng export'}
                  {stage === 'queued' && 'Job đang chờ trong queue…'}
                  {stage === 'querying' && 'Đang query DB…'}
                  {stage === 'writing' && 'Worker đang ghi file…'}
                  {stage === 'ready' && 'File sẵn sàng'}
                  {stage === 'failed' && 'Export thất bại'}
                </p>
              </div>
              <span className="status-board__pct">{Math.round(progress)}%</span>
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
                <dt>Job</dt>
                <dd>{jobId ?? '—'}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  )
}
