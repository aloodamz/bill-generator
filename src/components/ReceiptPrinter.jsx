import { useEffect, useRef, useState } from 'react'
import Receipt from './Receipt'

const EMERGE_TRANSITION =
  'grid-template-rows 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
const RETRACT_TRANSITION = 'grid-template-rows 0.45s cubic-bezier(0.4, 0, 1, 1)'

export default function ReceiptPrinter({ phase, transaction }) {
  const expanded = phase === 'printing' || phase === 'printed'
  const isPrinting = phase === 'printing'
  const [wobbleKey, setWobbleKey] = useState(0)
  const prevPhase = useRef(phase)

  useEffect(() => {
    if (phase === 'printing' && prevPhase.current !== 'printing') {
      setWobbleKey((k) => k + 1)
    }
    prevPhase.current = phase
  }, [phase])

  return (
    <div className="relative">
      {/* printer bezel / slot — overlaps the paper below by a couple px so
          the top edge looks tucked behind the lip rather than floating */}
      <div
        className={`relative z-20 mx-auto -mb-1.5 h-3.5 w-[86%] rounded-full bg-black/80 shadow-[inset_0_2px_3px_rgba(0,0,0,0.8)] ${
          isPrinting ? 'animate-printer-shake' : ''
        }`}
      >
        <div className="absolute inset-x-3 top-[3px] h-px bg-white/10" />
      </div>

      {/* emerging receipt */}
      <div
        className="relative z-10 grid justify-items-center"
        style={{
          gridTemplateRows: expanded ? '1fr' : '0fr',
          transition: phase === 'retracting' ? RETRACT_TRANSITION : EMERGE_TRANSITION,
        }}
      >
        <div className="min-h-0 overflow-hidden pt-2">
          {transaction && (
            <div
              key={wobbleKey}
              className={isPrinting ? 'animate-paper-wobble' : ''}
              style={{ transformOrigin: 'top center' }}
            >
              <Receipt transaction={transaction} isPrinting={isPrinting} />
            </div>
          )}
        </div>
      </div>

      {/* contact shadow on the "counter" */}
      {phase === 'printed' && (
        <div className="animate-fade-up mx-auto -mt-1 h-4 w-40 rounded-full bg-black/15 blur-md" />
      )}
    </div>
  )
}
