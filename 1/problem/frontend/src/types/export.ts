export type ExportFormat = 'csv' | 'xlsx' | 'json'

export type ExportStage =
  | 'idle'
  | 'queued'
  | 'querying'
  | 'writing'
  | 'ready'
  | 'failed'
