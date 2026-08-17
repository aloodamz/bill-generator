import { formatMoney } from '../utils/format'

function CartLine({ item, onIncrement, onDecrement, onRemove, disabled }) {
  return (
    <div className="animate-fade-up group grid grid-cols-[1fr_auto_60px] items-center gap-2.5 py-1.5">
      <div className="min-w-0">
        <p className="font-heading truncate text-[13.5px] font-medium text-neutral-900">
          {item.name}
        </p>
        <p className="font-mono text-[10px] tabular-nums text-neutral-400">
          {formatMoney(item.price)} each
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDecrement(item.id)}
          aria-label={`Decrease ${item.name} quantity`}
          className="flex h-5.5 w-5.5 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-900 active:scale-90 disabled:opacity-40"
        >
          −
        </button>
        <span className="w-4 text-center font-mono text-[13px] tabular-nums text-neutral-900">
          {item.qty}
        </span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onIncrement(item.id)}
          aria-label={`Increase ${item.name} quantity`}
          className="flex h-5.5 w-5.5 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-900 active:scale-90 disabled:opacity-40"
        >
          +
        </button>
      </div>

      <div className="flex items-center justify-end gap-1.5">
        <span className="font-mono text-[13px] tabular-nums text-neutral-900">
          {formatMoney(item.price * item.qty)}
        </span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name}`}
          className="text-neutral-300 transition hover:text-neutral-600 disabled:opacity-40"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default function Cart({ items, onIncrement, onDecrement, onRemove, disabled }) {
  return (
    <div className="px-4 pt-2.5">
      {items.length > 0 && (
        <div className="grid grid-cols-[1fr_auto_60px] gap-2.5 border-b border-neutral-200 pb-1 text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
          <span>Item</span>
          <span className="text-center">Qty</span>
          <span className="text-right">Price</span>
        </div>
      )}

      {items.length === 0 ? (
        <div className="my-2 rounded-lg border border-dashed border-neutral-300 py-4 text-center">
          <p className="text-[13px] text-neutral-400">Cart is empty</p>
          <p className="mt-0.5 text-[11px] text-neutral-300">
            Tap a product above to add it
          </p>
        </div>
      ) : (
        <div className="scrollbar-none max-h-[152px] divide-y divide-neutral-100 overflow-y-auto">
          {items.map((item) => (
            <CartLine
              key={item.id}
              item={item}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  )
}
