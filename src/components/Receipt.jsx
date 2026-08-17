import { useMemo } from 'react'
import { formatMoney, formatTransactionNo } from '../utils/format'
import Barcode from './Barcode'

const STORE_NAME = 'CORNER STORE'

// A jagged, hand-torn bottom edge — deterministic per transaction so it
// doesn't re-jitter on every re-render.
function useTornEdgePath(seed) {
  return useMemo(() => {
    let s = seed
    const rand = () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
    const teeth = 18
    const points = []
    for (let i = 0; i <= teeth; i++) {
      const x = (i / teeth) * 100
      // measured up *from the bottom edge* — a flat tooth sits flush with
      // the bottom, a torn one is pulled a few px above it
      const y = i % 2 === 0 ? '100%' : `calc(100% - ${(3 + rand() * 5).toFixed(1)}px)`
      points.push(`${x}% ${y}`)
    }
    return `polygon(0 0, 100% 0, ${points.slice().reverse().join(', ')})`
  }, [seed])
}

export default function Receipt({ transaction, isPrinting = false }) {
  const { id, dateTime, items, subtotal, tax, total, paymentMethod } =
    transaction
  const clipPath = useTornEdgePath(id)

  return (
    <div
      className="relative mx-auto w-[80%] max-w-[272px] bg-[#fbfaf5] font-mono text-neutral-800 drop-shadow-[0_14px_18px_rgba(0,0,0,0.3)]"
      style={{ clipPath, transform: 'rotate(-0.35deg)' }}
    >
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply" />

      {isPrinting && (
        <div
          className="animate-print-sweep pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.9) 8%, transparent 18%)',
            backgroundSize: '100% 500%',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      <div className="relative px-4 pt-5 pb-8 text-[11.5px] leading-[1.6]">
        <div className="text-center">
          <p className="text-[15px] font-bold tracking-[0.14em]">
            {STORE_NAME}
          </p>
          <p className="mt-2 border-t border-dashed border-neutral-400" />
          <p className="mt-2 text-[10.5px] tracking-[0.22em] text-neutral-500">
            PAYMENT RECEIPT
          </p>
        </div>

        <div className="mt-4 space-y-0.5 text-center text-[11px] text-neutral-500">
          <p className="whitespace-nowrap">Txn {formatTransactionNo(id)}</p>
          <p className="whitespace-nowrap">
            {dateTime.day} &bull; {dateTime.time}
          </p>
        </div>

        <div className="mt-3 border-t border-dashed border-neutral-400" />

        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_18px_minmax(52px,auto)] items-baseline gap-2"
            >
              <span className="min-w-0 truncate text-neutral-900">{item.name}</span>
              <span className="text-center tabular-nums text-neutral-500">
                {item.qty}
              </span>
              <span className="text-right tabular-nums text-neutral-900">
                {formatMoney(item.price * item.qty)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 border-t border-dashed border-neutral-400" />

        <div className="mt-3 space-y-1.5">
          <div className="flex justify-between text-neutral-500">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>Tax</span>
            <span className="tabular-nums">{formatMoney(tax)}</span>
          </div>
        </div>

        <div className="mt-3 border-t border-dashed border-neutral-400" />

        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-[13px] font-bold tracking-wide">TOTAL</span>
          <span className="text-[15px] font-bold tabular-nums">
            {formatMoney(total)}
          </span>
        </div>

        <p className="mt-4 text-center text-neutral-500">
          Payment: <span className="text-neutral-800">{paymentMethod}</span>
        </p>

        <div className="mt-6 flex justify-center">
          <Barcode value={formatTransactionNo(id)} />
        </div>

        <div className="mt-6 text-center tracking-[0.12em]">
          <p className="font-bold">THANK YOU!</p>
          <p className="mt-0.5 text-[10.5px] text-neutral-500">
            PLEASE VISIT AGAIN
          </p>
        </div>
      </div>
    </div>
  )
}
