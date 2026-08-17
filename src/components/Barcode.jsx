import { generateBarcodeWidths } from '../utils/barcode'

export default function Barcode({ value }) {
  const widths = generateBarcodeWidths(value)

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-9 items-stretch gap-[1.5px]">
        {widths.map((w, i) => (
          <span
            key={i}
            className="bg-neutral-900"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>
      <span className="text-[10px] tracking-[0.25em] text-neutral-500">
        {value}
      </span>
    </div>
  )
}
