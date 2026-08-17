import { useMemo, useState } from 'react'
import { formatMoney } from '../utils/format'

export default function ProductGrid({ products, onAdd, disabled }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q))
  }, [products, query])

  return (
    <div className="px-4 pt-3">
      <input
        type="text"
        value={query}
        disabled={disabled}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400 focus:bg-white disabled:opacity-50"
      />

      <div className="scrollbar-none mt-2 flex gap-2 overflow-x-auto pb-1">
        {filtered.map((product) => (
          <button
            key={product.id}
            type="button"
            disabled={disabled}
            onClick={() => onAdd(product)}
            className="flex shrink-0 flex-col items-start rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-left transition active:scale-[0.96] hover:border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 disabled:active:scale-100"
          >
            <span className="font-heading text-[13px] leading-tight font-medium whitespace-nowrap text-neutral-900">
              {product.name}
            </span>
            <span className="mt-0.5 font-mono text-[10.5px] tabular-nums text-neutral-500">
              {formatMoney(product.price)}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="w-full py-2 text-center text-xs text-neutral-400">
            No products match “{query}”
          </p>
        )}
      </div>
    </div>
  )
}
