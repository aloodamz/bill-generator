import { useEffect, useRef, useState } from 'react'
import Receipt from './Receipt'

// Kept in sync with the `printing` timeout in POSMachine.jsx — the paper
// should finish sliding out right as the stage flips to 'printed'.
export const PRINT_DURATION_MS = 2800

const EMERGE_TRANSITION = `grid-template-rows ${PRINT_DURATION_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
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

      {/* emerging receipt — no justify-items-center: that would make this
          grid item shrink-to-fit, and Receipt's percentage width can't
          resolve against an indefinite parent width (it collapses to a
          much narrower intrinsic size instead). Let it stretch full width
          and centering happens via Receipt's own mx-auto. */}
      <div
        className="relative z-10 grid"
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
              <Receipt transaction={transaction} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
