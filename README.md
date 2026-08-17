# Corner Store POS

A small countertop POS terminal, recreated in the browser. Ring up items,
take payment, and watch a thermal receipt physically print out of the
machine — no backend, no build step beyond Vite.

## What it does

- **Ring up a sale** — tap products into the cart, adjust quantities, remove
  items, watch subtotal/tax/total update live.
- **Take payment** — pick UPI / Card / Cash, hit Pay. A processing spinner
  and a success check run right on the terminal's screen — no toast popups.
- **Preview the bill** — once payment clears, the digital receipt shows up
  on-screen for a final look before anything prints.
- **Print it** — tap Print and the on-screen bill slides down into the
  machine while a thermal receipt emerges from the printer slot below:
  torn paper edge, barcode, paper texture, a little printer shake, all
  driven by CSS (grid-row transitions + clip-path), no animation library.
- **Reprint or start over** — Print again replays the printer animation;
  New transaction resets the till and bumps the transaction number.

## Stack

React 19 + Vite + Tailwind CSS v4. That's it — no state library, no UI kit,
no animation library. A few lines of the Web Audio API generate the payment
chime and printer buzz on the fly instead of shipping audio files.

## Running it

```bash
npm install
npm run dev
```

## Structure

```
src/
  components/
    POSMachine.jsx        # owns all state — cart, transaction stage, timers
    POSHeader.jsx          # store name, clock, status, transaction #
    ProductGrid.jsx        # search + horizontal product strip
    Cart.jsx                # line items, qty steppers, scrollable list
    PaymentSummary.jsx     # subtotal / tax / total, payment method
    PaymentButton.jsx      # the big Pay button
    PaymentStatusOverlay.jsx  # processing / success overlay on the screen
    BillPreview.jsx         # on-screen receipt preview + Print button
    OrderComplete.jsx       # post-print confirmation + Print again / New sale
    ReceiptPrinter.jsx      # the physical printer slot + emerging paper
    Receipt.jsx              # the receipt itself — reused by both preview
                              # and the physical printout
    Barcode.jsx              # deterministic pseudo-barcode from the txn id
  data/products.js         # mock catalog — swap for a fetch() later
  hooks/useClock.js
  utils/{format,barcode,sound}.js
```

The transaction moves through one state machine in `POSMachine.jsx`:

```
idle → processing → success → reviewing → dispatching → printing → printed
                                                              ↕
                                                         retracting
```

`reviewing` is the on-screen bill preview; tapping Print triggers
`dispatching` (the preview slides out) which hands off to `printing` (the
physical receipt emerges). `retracting` is the shared transition used by
both "Print again" and "New transaction" to pull the paper back before
replaying or resetting.

## Swapping in a real backend

`data/products.js` exports a flat `{ id, name, price }[]` array — replace it
with a fetched catalog and nothing else needs to change. Payment is
simulated with `setTimeout`; swap `handlePay` in `POSMachine.jsx` for a real
charge call and keep the same stage transitions.
