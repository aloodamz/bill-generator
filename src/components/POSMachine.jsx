import { useEffect, useRef, useState } from 'react'
import { PRODUCTS } from '../data/products'
import { formatDateTime } from '../utils/format'
import { playPaymentSuccess, playPrinterBuzz, primeAudio } from '../utils/sound'
import POSHeader from './POSHeader'
import ProductGrid from './ProductGrid'
import Cart from './Cart'
import PaymentSummary from './PaymentSummary'
import PaymentButton from './PaymentButton'
import PaymentStatusOverlay from './PaymentStatusOverlay'
import BillPreview from './BillPreview'
import OrderComplete from './OrderComplete'
import ReceiptPrinter from './ReceiptPrinter'

const TAX_RATE = 0.05
const START_TXN_ID = 482

// idle -> processing -> success -> reviewing -> dispatching -> printing -> printed -> (retracting -> idle | printing)
const SALE_STAGES = new Set(['idle', 'processing', 'success'])
const PREVIEW_STAGES = new Set(['reviewing', 'dispatching'])

export default function POSMachine() {
  const [cart, setCart] = useState([])
  const [transactionId, setTransactionId] = useState(START_TXN_ID)
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [stage, setStage] = useState('idle')
  const [lastTransaction, setLastTransaction] = useState(null)

  const timeouts = useRef([])
  useEffect(() => () => timeouts.current.forEach(clearTimeout), [])
  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay)
    timeouts.current.push(id)
  }
  const clearScheduled = () => {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
  }

  const locked = stage !== 'idle'

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + tax

  function addItem(product) {
    if (locked) return
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  function incrementItem(id) {
    if (locked) return
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
    )
  }

  function decrementItem(id) {
    if (locked) return
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    )
  }

  function removeItem(id) {
    if (locked) return
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  function handlePay() {
    if (locked || cart.length === 0) return
    // Resume/create the AudioContext synchronously inside the click handler
    // — Safari won't allow audio to start once we're several ticks removed
    // from the user gesture (i.e. inside the setTimeout chain below).
    primeAudio()
    clearScheduled()
    setStage('processing')
    schedule(() => {
      playPaymentSuccess()
      setStage('success')
      schedule(() => {
        setLastTransaction({
          id: transactionId,
          dateTime: formatDateTime(new Date()),
          items: cart,
          subtotal,
          tax,
          total,
          paymentMethod,
        })
        setStage('reviewing')
      }, 650)
    }, 900)
  }

  function handlePrintReceipt() {
    if (stage !== 'reviewing') return
    primeAudio()
    clearScheduled()
    setStage('dispatching')
    schedule(() => {
      setStage('printing')
      playPrinterBuzz(1.5)
      schedule(() => setStage('printed'), 1500)
    }, 500)
  }

  function handlePrintAgain() {
    if (stage !== 'printed') return
    primeAudio()
    clearScheduled()
    setStage('retracting')
    schedule(() => {
      setStage('printing')
      playPrinterBuzz(1.4)
      schedule(() => setStage('printed'), 1500)
    }, 450)
  }

  function handleNewTransaction() {
    clearScheduled()
    setStage('retracting')
    schedule(() => {
      setCart([])
      setLastTransaction(null)
      setPaymentMethod('UPI')
      setTransactionId((id) => id + 1)
      setStage('idle')
    }, 450)
  }

  return (
    <div className="w-full max-w-[380px]">
      <div className="rounded-[28px] bg-neutral-900 p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.55)]">
        {/* status LEDs — purely decorative chassis detail */}
        <div className="flex items-center justify-center gap-1 py-1.5">
          <span className="h-1 w-1 rounded-full bg-neutral-700" />
          <span className="h-1 w-1 rounded-full bg-neutral-700" />
          <span className="h-1 w-1 rounded-full bg-neutral-700" />
        </div>

        <div className="relative overflow-hidden rounded-[22px] bg-neutral-50 ring-1 ring-black/5">
          <POSHeader transactionId={transactionId} />

          {SALE_STAGES.has(stage) && (
            <>
              <ProductGrid products={PRODUCTS} onAdd={addItem} disabled={locked} />
              <Cart
                items={cart}
                onIncrement={incrementItem}
                onDecrement={decrementItem}
                onRemove={removeItem}
                disabled={locked}
              />
              <PaymentSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                method={paymentMethod}
                onMethodChange={setPaymentMethod}
                disabled={locked}
              />
              <PaymentButton
                total={total}
                stage={stage}
                cartEmpty={cart.length === 0}
                onPay={handlePay}
              />
              <PaymentStatusOverlay stage={stage} method={paymentMethod} total={total} />
            </>
          )}

          {PREVIEW_STAGES.has(stage) && lastTransaction && (
            <BillPreview transaction={lastTransaction} stage={stage} onPrint={handlePrintReceipt} />
          )}

          {(stage === 'printing' || stage === 'printed' || stage === 'retracting') &&
            lastTransaction && (
              <OrderComplete
                stage={stage}
                transaction={lastTransaction}
                onPrintAgain={handlePrintAgain}
                onNewTransaction={handleNewTransaction}
              />
            )}
        </div>

        <div className="pt-3 pb-1">
          <ReceiptPrinter phase={stage} transaction={lastTransaction} />
        </div>
      </div>
    </div>
  )
}
