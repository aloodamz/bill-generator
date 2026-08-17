// Mock catalog — swap this for an API call (e.g. GET /api/products) later.
// Each consumer only relies on { id, name, price }, so the shape is safe to
// keep when wiring up a real backend.
export const PRODUCTS = [
  { id: 'cold-coffee', name: 'Cold Coffee', price: 180 },
  { id: 'cappuccino', name: 'Cappuccino', price: 140 },
  { id: 'sandwich', name: 'Sandwich', price: 120 },
  { id: 'veg-burger', name: 'Veg Burger', price: 150 },
  { id: 'french-fries', name: 'French Fries', price: 110 },
  { id: 'chocolate-cake', name: 'Chocolate Cake', price: 160 },
  { id: 'bottled-water', name: 'Bottled Water', price: 30 },
]
