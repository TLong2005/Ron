import type { ExportStage } from '../types/export'

const STEPS: { key: ExportStage; label: string; hint: string }[] = [
  { key: 'querying', label: 'Query DB', hint: 'Lấy dữ liệu' },
  { key: 'writing', label: 'Write file', hint: 'Ghi ~500MB' },
  { key: 'ready', label: 'Ready', hint: 'Tải khi sẵn sàng' },
]

const ORDER: ExportStage[] = ['idle', 'queued', 'querying', 'writing', 'ready']

function rank(stage: ExportStage) {
  const i = ORDER.indexOf(stage)
  return i === -1 ? 0 : i
}

interface PipelineProps {
  stage: ExportStage
  progress: number
}

export function Pipeline({ stage, progress }: PipelineProps) {
  const current = rank(stage === 'failed' ? 'idle' : stage)

  return (
    <ol className="pipeline" aria-label="Export pipeline">
      {STEPS.map((step, index) => {
        const stepRank = rank(step.key)
        const done = current > stepRank || stage === 'ready'
        const active = stage === step.key || (stage === 'queued' && index === 0)
        return (
          <li
            key={step.key}
            className={[
              'pipeline__step',
              done ? 'is-done' : '',
              active ? 'is-active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="pipeline__index">{String(index + 1).padStart(2, '0')}</span>
            <div className="pipeline__body">
              <strong>{step.label}</strong>
              <span>{step.hint}</span>
            </div>
            {active && stage !== 'ready' && (
              <span className="pipeline__pulse" aria-hidden="true" />
            )}
          </li>
        )
      })}
      <li className="pipeline__meter" aria-hidden="true">
        <div className="pipeline__meter-track">
          <div
            className="pipeline__meter-fill"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      </li>
    </ol>
  )
}
