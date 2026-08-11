import { useState } from 'react'
import {
  createIdempotencyKey,
  createPayment,
  fireDuplicatePayments,
  type CreatePaymentBody,
  type PaymentAttemptLog,
} from '../api/payment'

const DEFAULT_BODY: CreatePaymentBody = {
  orderId: 'order-demo-001',
  amount: 199000,
  currency: 'VND',
}

export function IdempotencyLab() {
  const [orderId, setOrderId] = useState(DEFAULT_BODY.orderId)
  const [amount, setAmount] = useState(DEFAULT_BODY.amount)
  const [idempotencyKey, setIdempotencyKey] = useState(createIdempotencyKey)
  const [busy, setBusy] = useState(false)
  const [logs, setLogs] = useState<PaymentAttemptLog[]>([])
  const [hint, setHint] = useState<string | null>(null)

  const body: CreatePaymentBody = {
    orderId,
    amount,
    currency: 'VND',
  }

  /** Mỗi lần bấm scenario = một thao tác mới → auto-gen key mới, retry dùng lại key đó. */
  function nextPaymentKey() {
    const key = createIdempotencyKey()
    setIdempotencyKey(key)
    return key
  }

  async function run(scenario: 'parallel-same-key' | 'retry-same-key' | 'two-keys') {
    setBusy(true)
    setLogs([])
    setHint(null)

    try {
      if (scenario === 'parallel-same-key') {
        const key = nextPaymentKey()
        setHint(
          'Mạng/client gửi 2 request giống hệt cùng lúc (cùng Idempotency-Key). Backend chuẩn → 1 payment.',
        )
        const result = await fireDuplicatePayments(body, key, 2)
        setLogs(result)
        return
      }

      if (scenario === 'retry-same-key') {
        const key = nextPaymentKey()
        setHint(
          'Giả lập retry: gọi lần 1, đợi 300ms, gọi lại cùng key (user bấm lại / client retry).',
        )
        const first = await createPayment(body, key)
        const t0 = performance.now()
        await new Promise((r) => setTimeout(r, 300))
        const second = await createPayment(body, key)
        const t1 = performance.now()
        setLogs([
          {
            label: 'attempt-1',
            idempotencyKey: key,
            ok: first.status >= 200 && first.status < 300,
            status: first.status,
            body: first.body,
            startedAt: t0,
            finishedAt: t0,
          },
          {
            label: 'attempt-2-retry',
            idempotencyKey: key,
            ok: second.status >= 200 && second.status < 300,
            status: second.status,
            body: second.body,
            startedAt: t0,
            finishedAt: t1,
          },
        ])
        return
      }

      // two different keys → backend nên tạo 2 payment (control case)
      const keyA = createIdempotencyKey()
      const keyB = createIdempotencyKey()
      setIdempotencyKey(keyA)
      setHint('Hai key khác nhau = hai thao tác khác nhau → được phép tạo 2 payment.')
      const [a, b] = await Promise.all([
        createPayment(body, keyA),
        createPayment({ ...body, orderId: `${orderId}-b` }, keyB),
      ])
      const now = performance.now()
      setLogs([
        {
          label: 'key-A',
          idempotencyKey: keyA,
          ok: a.status >= 200 && a.status < 300,
          status: a.status,
          body: a.body,
          startedAt: now,
          finishedAt: now,
        },
        {
          label: 'key-B',
          idempotencyKey: keyB,
          ok: b.status >= 200 && b.status < 300,
          status: b.status,
          body: b.body,
          startedAt: now,
          finishedAt: now,
        },
      ])
    } catch (error) {
      setHint(error instanceof Error ? error.message : 'Chạy scenario thất bại')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="studio lab">
      <div className="studio__grid">
        <div className="studio__controls">
          <div className="field">
            <span className="field__label">Problem 03 — Duplicate request</span>
            <p className="lab__lead">
              Giả lập request gửi hai lần (network / retry / replay). Backend cần idempotent
              theo header <code>Idempotency-Key</code>.
            </p>
          </div>

          <label className="field">
            <span className="field__label">Order ID</span>
            <input
              className="lab__input"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              disabled={busy}
            />
          </label>

          <label className="field">
            <span className="field__label">Amount (VND)</span>
            <input
              className="lab__input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              disabled={busy}
            />
          </label>

          <label className="field">
            <span className="field__label">Idempotency-Key (auto UUID)</span>
            <div className="lab__key-row">
              <input
                className="lab__input"
                value={idempotencyKey}
                readOnly
                disabled={busy}
                title="Tự gen mỗi lần chạy scenario; retry dùng lại cùng key"
              />
              <button
                type="button"
                className="btn"
                disabled={busy}
                onClick={() => setIdempotencyKey(createIdempotencyKey())}
              >
                New key
              </button>
            </div>
          </label>

          <div className="studio__actions lab__actions">
            <button
              type="button"
              className="btn btn--primary"
              disabled={busy}
              onClick={() => void run('parallel-same-key')}
            >
              {busy ? 'Đang gửi…' : '1. Gửi 2 request song song (cùng key)'}
            </button>
            <button
              type="button"
              className="btn btn--download"
              disabled={busy}
              onClick={() => void run('retry-same-key')}
            >
              2. Retry cùng key (cách 300ms)
            </button>
            <button
              type="button"
              className="btn"
              disabled={busy}
              onClick={() => void run('two-keys')}
            >
              3. Hai key khác nhau (control)
            </button>
          </div>

          {hint && (
            <p className="toast toast--pending" role="status">
              {hint}
            </p>
          )}
        </div>

        <aside className="studio__status" aria-live="polite">
          <div className="status-board">
            <div className="status-board__top">
              <div>
                <span className="badge badge--queued">Responses</span>
                <p className="status-board__msg">
                  So sánh <code>paymentId</code> / body của 2 lần gọi. Cùng key → phải giống
                  nhau (hoặc lần 2 trả bản đã lưu).
                </p>
              </div>
              <span className="status-board__pct">{logs.length}</span>
            </div>

            <ul className="lab__logs">
              {logs.length === 0 && <li className="lab__empty">Chưa có response</li>}
              {logs.map((log) => (
                <li key={`${log.label}-${log.idempotencyKey}`} className="lab__log">
                  <div className="lab__log-head">
                    <strong>{log.label}</strong>
                    <span className={log.ok ? 'lab__ok' : 'lab__fail'}>
                      {log.error ? log.error : `HTTP ${log.status}`}
                    </span>
                  </div>
                  <code className="lab__mono">key: {log.idempotencyKey}</code>
                  <pre className="lab__pre">{JSON.stringify(log.body, null, 2)}</pre>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}
