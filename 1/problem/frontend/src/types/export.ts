export type ExportFormat = 'csv'

export type ExportStage =
  | 'idle'
  | 'queued'
  | 'querying'
  | 'writing'
  | 'ready'
  | 'failed'
