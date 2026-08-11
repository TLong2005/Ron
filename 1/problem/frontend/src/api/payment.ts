const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export type CreatePaymentBody = {
  orderId: string
  amount: number
  currency: string
}

export type PaymentAttemptLog = {
  label: string
  idempotencyKey: string
  ok: boolean
  status: number
  body: unknown
  startedAt: number
  finishedAt: number
  error?: string
}

/** Tạo Idempotency-Key chuẩn (UUID) cho một lần thao tác thanh toán. */
export function createIdempotencyKey() {
  return crypto.randomUUID()
}

/**
 * Một lần gọi thanh toán — luôn gửi Idempotency-Key.
 * Nếu không truyền key, auto-gen UUID (mỗi thao tác mới một key).
 */
export async function createPayment(
  body: CreatePaymentBody,
  idempotencyKey: string = createIdempotencyKey(),
): Promise<{ status: number; body: unknown; idempotencyKey: string }> {
  const res = await fetch(`${API_BASE}/api/v1/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(body),
  })

  let parsed: unknown = null
  const text = await res.text()
  try {
    parsed = text ? JSON.parse(text) : null
  } catch {
    parsed = text
  }

  return { status: res.status, body: parsed, idempotencyKey }
}

/**
 * Giả lập mạng xấu: bắn N request giống hệt (cùng key + cùng body) song song.
 * Backend đúng → chỉ tạo 1 payment; sai → tạo N lần.
 */
export async function fireDuplicatePayments(
  body: CreatePaymentBody,
  idempotencyKey: string,
  times = 2,
): Promise<PaymentAttemptLog[]> {
  const startedAt = performance.now()

  const tasks = Array.from({ length: times }, (_, i) =>
    createPayment(body, idempotencyKey)
      .then((res) => ({
        label: `attempt-${i + 1}`,
        idempotencyKey,
        ok: res.status >= 200 && res.status < 300,
        status: res.status,
        body: res.body,
        startedAt,
        finishedAt: performance.now(),
      }))
      .catch((error: unknown) => ({
        label: `attempt-${i + 1}`,
        idempotencyKey,
        ok: false,
        status: 0,
        body: null,
        startedAt,
        finishedAt: performance.now(),
        error: error instanceof Error ? error.message : 'Network error',
      })),
  )

  return Promise.all(tasks)
}
