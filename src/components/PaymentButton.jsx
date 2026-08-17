import { formatMoney } from '../utils/format'

const LABELS = {
  processing: 'Processing…',
  success: 'Payment successful',
}

export default function PaymentButton({ total, stage, cartEmpty, onPay }) {
  const isIdle = stage === 'idle'
  const isSettled = stage === 'success'
  const label = isIdle ? `Pay ${formatMoney(total)}` : LABELS[stage]

  return (
    <div className="px-4 pt-3 pb-3.5">
      <button
        type="button"
        disabled={!isIdle || cartEmpty}
        onClick={onPay}
        className={`font-heading flex h-12 w-full items-center justify-center rounded-xl text-[15px] font-bold tracking-wide text-white transition-all duration-300 disabled:cursor-not-allowed ${
          isSettled
            ? 'bg-emerald-600'
            : 'bg-neutral-900 enabled:hover:bg-neutral-800 enabled:active:scale-[0.98]'
        } ${isIdle && cartEmpty ? 'opacity-40' : ''}`}
      >
        {label}
      </button>
    </div>
  )
}
