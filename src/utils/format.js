const currencyFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
})

export function formatMoney(amount) {
  return `₹${currencyFormatter.format(Math.round(amount))}`
}

export function formatDateTime(date) {
  const day = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const time = date
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .replace(/^0/, '')
  return { day, time }
}

export function formatTransactionNo(n) {
  return `#${String(n).padStart(5, '0')}`
}
