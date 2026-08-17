// Deterministic pseudo-barcode generator — same transaction always renders
// the same bar pattern, without needing a real barcode library.
function seededRandom(seed) {
  let value = seed
  return () => {
    value |= 0
    value = (value + 0x6d2b79f5) | 0
    let t = Math.imul(value ^ (value >>> 15), 1 | value)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

export function generateBarcodeWidths(seed, barCount = 34) {
  const rand = seededRandom(hashString(String(seed)))
  const widths = []
  for (let i = 0; i < barCount; i++) {
    const r = rand()
    widths.push(r < 0.55 ? 1 : r < 0.85 ? 2 : 3)
  }
  return widths
}
