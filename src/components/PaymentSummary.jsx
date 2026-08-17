import { formatMoney } from '../utils/format'

const METHODS = ['UPI', 'Card', 'Cash']

export default function PaymentSummary({
  subtotal,
  tax,
  total,
  method,
  onMethodChange,
  disabled,
}) {
  return (
    <div className="border-t border-neutral-200 px-4 pt-2.5">
      <div className="flex justify-between text-[12.5px] text-neutral-600">
        <span>Subtotal</span>
        <span className="font-mono tabular-nums">{formatMoney(subtotal)}</span>
      </div>
      <div className="mt-1 flex justify-between text-[12.5px] text-neutral-600">
        <span>Tax</span>
        <span className="font-mono tabular-nums">{formatMoney(tax)}</span>
      </div>

      <div className="mt-2 border-t border-dashed border-neutral-300" />

      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-heading text-[13px] font-semibold tracking-wide text-neutral-900 uppercase">
          Total
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums text-neutral-900">
          {formatMoney(total)}
        </span>
      </div>

      <div className="mt-2.5 flex gap-2">
        {METHODS.map((m) => (
          <button
            key={m}
            type="button"
            disabled={disabled}
            onClick={() => onMethodChange(m)}
            className={`flex-1 rounded-md border px-2 py-1 text-[12px] font-medium transition disabled:opacity-50 ${
              method === m
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}
