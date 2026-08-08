import type { ExportFormat } from '../types/export'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export type ExportFileResponse = {
  status: number
}

export async function exportFile(type: ExportFormat): Promise<ExportFileResponse> {
  const params = new URLSearchParams({ type })
  const res = await fetch(`${API_BASE}/api/v1/file/export?${params}`)

  if (!res.ok) {
    throw new Error(`Export thất bại (${res.status})`)
  }

  return res.json() as Promise<ExportFileResponse>
}
