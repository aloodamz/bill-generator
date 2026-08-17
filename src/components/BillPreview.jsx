import Receipt from './Receipt'

export default function BillPreview({ transaction, stage, onPrint }) {
  const isDispatching = stage === 'dispatching'

  return (
    <div className="animate-fade-up flex flex-col px-4 pt-3 pb-3.5">
      <p className="text-[10px] font-medium tracking-wider text-neutral-500 uppercase">
        Ready to print
      </p>

      <div className="scrollbar-none mt-2 max-h-[260px] overflow-hidden rounded-xl bg-neutral-200/70 py-4">
        <div className="scrollbar-none max-h-[260px] overflow-y-auto">
          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,1,1)] ${
              isDispatching ? 'translate-y-[140%] opacity-0' : 'translate-y-0 opacity-100'
            }`}
          >
            <Receipt transaction={transaction} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onPrint}
        disabled={isDispatching}
        className="font-heading mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 text-[15px] font-bold tracking-wide text-white transition-all duration-300 enabled:hover:bg-neutral-800 enabled:active:scale-[0.98] disabled:opacity-60"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-white stroke-[1.6]">
          <rect x="4" y="3" width="12" height="6" rx="1" />
          <rect x="3" y="9" width="14" height="7" rx="1.5" />
          <rect x="6.5" y="12" width="7" height="4" fill="white" stroke="none" />
        </svg>
        {isDispatching ? 'Printing…' : 'Print receipt'}
      </button>
    </div>
  )
}
