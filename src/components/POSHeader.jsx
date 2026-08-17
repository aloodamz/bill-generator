import { useClock } from '../hooks/useClock'
import { formatDateTime, formatTransactionNo } from '../utils/format'

export default function POSHeader({ transactionId }) {
  const now = useClock()
  const { day, time } = formatDateTime(now)

  return (
    <div className="flex items-start justify-between border-b border-neutral-200 px-4 py-2.5">
      <div>
        <p className="font-heading text-[17px] font-semibold tracking-tight text-neutral-900">
          Corner Store
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-neutral-500">
          {day} &bull; {time}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-status-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-500" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-medium tracking-wider text-neutral-500 uppercase">
            Online
          </span>
        </div>
        <p className="font-mono text-[11px] text-neutral-500">
          Txn {formatTransactionNo(transactionId)}
        </p>
      </div>
    </div>
  )
}
