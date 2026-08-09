export type ExportFormat = 'csv'

export type ExportStage =
  | 'idle'
  | 'queued'
  | 'querying'
  | 'writing'
  | 'ready'
  | 'failed'

/** Map BullMQ job state → UI stage */
export function mapJobStateToStage(state: string): ExportStage {
  switch (state) {
    case 'waiting':
    case 'delayed':
    case 'prioritized':
    case 'waiting-children':
      return 'queued'
    case 'active':
      return 'writing'
    case 'completed':
      return 'ready'
    case 'failed':
    case 'not_found':
      return 'failed'
    default:
      return 'queued'
  }
}
