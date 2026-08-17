import { formatTransactionNo } from '../utils/format'

export default function OrderComplete({ stage, transaction, onPrintAgain, onNewTransaction }) {
  const isPrinted = stage === 'printed'

  return (
    <div className="animate-fade-up flex flex-col items-center gap-3 px-4 pt-6 pb-3.5 text-center">
      {isPrinted ? (
        <>
          <span className="animate-check-pop flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500">
            <svg viewBox="0 0 16 16" className="h-6 w-6 fill-none stroke-white stroke-[2.5]">
              <path d="M3 8.5L6.5 12L13 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="font-heading text-sm font-semibold text-neutral-900">
              Sale complete
            </p>
            <p className="mt-0.5 font-mono text-xs tabular-nums text-neutral-500">
              Receipt {formatTransactionNo(transaction.id)} printed
            </p>
          </div>

          <div className="mt-1 flex w-full gap-2">
            <button
              type="button"
              onClick={onPrintAgain}
              className="h-12 flex-1 rounded-xl border border-neutral-300 text-[13.5px] font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900 active:scale-[0.98]"
            >
              Print again
            </button>
            <button
              type="button"
              onClick={onNewTransaction}
              className="font-heading h-12 flex-[1.6] rounded-xl bg-neutral-900 text-[14.5px] font-bold tracking-wide text-white transition hover:bg-neutral-800 active:scale-[0.98]"
            >
              New transaction
            </button>
          </div>
        </>
      ) : (
        <>
          <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-neutral-200 border-t-neutral-900" />
          <p className="text-xs text-neutral-500">Printing receipt…</p>
        </>
      )}
    </div>
  )
}
