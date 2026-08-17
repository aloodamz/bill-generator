import { formatMoney } from '../utils/format'

export default function PaymentStatusOverlay({ stage, method, total }) {
  const visible = stage === 'processing' || stage === 'success'
  const isSuccess = stage === 'success'

  return (
    <div
      className={`absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-[22px] bg-white/85 backdrop-blur-md transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!visible}
    >
      {stage === 'processing' && (
        <>
          <span className="h-12 w-12 animate-spin rounded-full border-[3px] border-neutral-200 border-t-neutral-900" />
          <div className="text-center">
            <p className="text-sm font-semibold text-neutral-900">
              Processing payment
            </p>
            <p className="mt-0.5 text-xs text-neutral-400">via {method}</p>
          </div>
        </>
      )}

      {isSuccess && (
        <>
          <span className="animate-check-pop flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500">
            <svg
              viewBox="0 0 16 16"
              className="h-7 w-7 fill-none stroke-white stroke-[2.5]"
            >
              <path
                d="M3 8.5L6.5 12L13 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="text-center">
            <p className="text-sm font-semibold text-neutral-900">
              Payment successful
            </p>
            <p className="mt-0.5 font-mono text-xs text-neutral-400">
              {formatMoney(total)} received
            </p>
          </div>
        </>
      )}
    </div>
  )
}
