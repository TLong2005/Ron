const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export type ExportFileResponse = {
  status: number
  jobId: string
}

export type ExportStatusResponse = {
  jobId: string
  state: string
  progress: number
  failedReason?: string | null
  returnvalue?: unknown
}

export async function exportFile(): Promise<ExportFileResponse> {
  const params = new URLSearchParams({ type: 'csv' })
  const res = await fetch(`${API_BASE}/api/v1/file/export?${params}`)

  if (!res.ok) {
    throw new Error(`Export thất bại (${res.status})`)
  }

  return res.json() as Promise<ExportFileResponse>
}

export async function getExportStatus(jobId: string): Promise<ExportStatusResponse> {
  const res = await fetch(`${API_BASE}/api/v1/file/export/${jobId}/status`)

  if (!res.ok) {
    throw new Error(`Lấy status thất bại (${res.status})`)
  }

  return res.json() as Promise<ExportStatusResponse>
}

export function getExportDownloadUrl(jobId: string) {
  return `${API_BASE}/api/v1/file/export/${jobId}/download`
}
