'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/components/cart/CartProvider'
import { PayloadImage } from '@/components/ui/PayloadImage'
import { CURRENCY, ROUTES } from '@/constants'
import { formatCartPrice } from '@/lib/cart/product'

const STEPS = [
  { id: 1, label: 'Kontakt' },
  { id: 2, label: 'Dostava' },
  { id: 3, label: 'Pregled' },
]

const EMPTY_CONTACT = { firstName: '', lastName: '', email: '', phone: '' }
const EMPTY_DELIVERY = { street: '', city: '', zip: '', country: 'Srbija', note: '' }

export default function CheckoutPage() {
  const { items, subtotal, isHydrated, clearCart } = useCart()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [contact, setContact] = useState(EMPTY_CONTACT)
  const [delivery, setDelivery] = useState(EMPTY_DELIVERY)
  const [placing, setPlacing] = useState(false)
  const [done, setDone] = useState(false)
  const [orderRef] = useState(() => `ORD-${Date.now().toString(36).toUpperCase()}`)

  function updateContact(field, value) {
    setContact((prev) => ({ ...prev, [field]: value }))
  }

  function updateDelivery(field, value) {
    setDelivery((prev) => ({ ...prev, [field]: value }))
  }

  function handleContactSubmit(e) {
    e.preventDefault()
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDeliverySubmit(e) {
    e.preventDefault()
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handlePlaceOrder() {
    setPlacing(true)
    // TODO: POST to /api/orders when the Orders collection is added to the backend
    await new Promise((r) => setTimeout(r, 1200))
    clearCart()
    setDone(true)
    setPlacing(false)
  }

  if (!isHydrated) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-sm text-zinc-500">Učitavanje...</div>
      </div>
    )
  }

  if (isHydrated && items.length === 0 && !done) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-zinc-400">Korpa je prazna</p>
        <Link
          href={ROUTES.products}
          className="text-xs font-medium tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
        >
          Idi na proizvode →
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-zinc-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">Porudžbina primljena</div>
          <h1 className="mt-3 text-2xl font-bold text-white">Hvala na porudžbini!</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Broj porudžbine: <span className="font-mono text-white">{orderRef}</span>
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Potvrdu ćemo poslati na{' '}
            <span className="text-zinc-300">{contact.email}</span>
          </p>
          <div className="mt-8 space-y-3">
            <Link
              href={ROUTES.products}
              className="block h-12 border border-white px-8 leading-[3rem] text-xs font-medium tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black"
            >
              Nastavi kupovinu
            </Link>
            <Link
              href={ROUTES.account}
              className="block text-xs font-medium tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
            >
              Moje porudžbine
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const shippingCost = 0 // free shipping placeholder

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Step indicator */}
      <div className="mb-10 flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              type="button"
              onClick={() => step > s.id && setStep(s.id)}
              disabled={step <= s.id}
              className="flex items-center gap-2.5 disabled:cursor-default"
            >
              <span
                className={`flex h-7 w-7 items-center justify-center text-xs font-semibold transition-colors ${
                  step === s.id
                    ? 'bg-white text-black'
                    : step > s.id
                      ? 'border border-zinc-700 text-zinc-400'
                      : 'border border-zinc-800 text-zinc-700'
                }`}
              >
                {step > s.id ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                ) : (
                  s.id
                )}
              </span>
              <span
                className={`text-xs font-medium tracking-widest uppercase ${
                  step === s.id ? 'text-white' : 'text-zinc-600'
                }`}
              >
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`mx-4 h-px w-10 ${step > s.id ? 'bg-zinc-700' : 'bg-zinc-900'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main form area */}
        <div>
          {step === 1 && (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <h2 className="text-lg font-semibold text-white">Kontakt podaci</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ime" required>
                  <input
                    type="text"
                    required
                    value={contact.firstName}
                    onChange={(e) => updateContact('firstName', e.target.value)}
                    className={inputCls}
                    placeholder="Petar"
                  />
                </Field>
                <Field label="Prezime" required>
                  <input
                    type="text"
                    required
                    value={contact.lastName}
                    onChange={(e) => updateContact('lastName', e.target.value)}
                    className={inputCls}
                    placeholder="Petrović"
                  />
                </Field>
              </div>
              <Field label="Email" required>
                <input
                  type="email"
                  required
                  value={contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  className={inputCls}
                  placeholder="ime@email.com"
                />
              </Field>
              <Field label="Telefon" required>
                <input
                  type="tel"
                  required
                  value={contact.phone}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  className={inputCls}
                  placeholder="+381 60 000 0000"
                />
              </Field>
              <StepActions>
                <SubmitButton>Nastavi na dostavu →</SubmitButton>
                <BackLink href={ROUTES.cart} label="← Nazad na korpu" />
              </StepActions>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleDeliverySubmit} className="space-y-6">
              <h2 className="text-lg font-semibold text-white">Adresa dostave</h2>
              <Field label="Ulica i broj" required>
                <input
                  type="text"
                  required
                  value={delivery.street}
                  onChange={(e) => updateDelivery('street', e.target.value)}
                  className={inputCls}
                  placeholder="Knez Mihailova 10"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Grad" required>
                  <input
                    type="text"
                    required
                    value={delivery.city}
                    onChange={(e) => updateDelivery('city', e.target.value)}
                    className={inputCls}
                    placeholder="Beograd"
                  />
                </Field>
                <Field label="Poštanski broj" required>
                  <input
                    type="text"
                    required
                    value={delivery.zip}
                    onChange={(e) => updateDelivery('zip', e.target.value)}
                    className={inputCls}
                    placeholder="11000"
                  />
                </Field>
              </div>
              <Field label="Zemlja">
                <input
                  type="text"
                  value={delivery.country}
                  onChange={(e) => updateDelivery('country', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Napomena (opciono)">
                <textarea
                  value={delivery.note}
                  onChange={(e) => updateDelivery('note', e.target.value)}
                  rows={3}
                  className={`${inputCls} h-auto resize-none py-3`}
                  placeholder="Npr. zvoni 2x, ostavi kod portira..."
                />
              </Field>

              <div className="border border-zinc-800 p-4">
                <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
                  Način dostave
                </div>
                <label className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center border-2 border-white">
                      <span className="h-2 w-2 bg-white" />
                    </span>
                    <div>
                      <div className="text-sm font-medium text-white">Standardna dostava</div>
                      <div className="text-xs text-zinc-500">3–5 radnih dana</div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-white">Besplatno</span>
                </label>
              </div>

              <StepActions>
                <SubmitButton>Nastavi na pregled →</SubmitButton>
                <BackLink onClick={() => setStep(1)} label="← Nazad" />
              </StepActions>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white">Pregled porudžbine</h2>

              <ReviewSection title="Kontakt podaci" onEdit={() => setStep(1)}>
                <p className="text-sm text-zinc-300">{contact.firstName} {contact.lastName}</p>
                <p className="text-sm text-zinc-500">{contact.email}</p>
                <p className="text-sm text-zinc-500">{contact.phone}</p>
              </ReviewSection>

              <ReviewSection title="Adresa dostave" onEdit={() => setStep(2)}>
                <p className="text-sm text-zinc-300">{delivery.street}</p>
                <p className="text-sm text-zinc-500">{delivery.zip} {delivery.city}, {delivery.country}</p>
                {delivery.note && (
                  <p className="mt-1 text-xs text-zinc-600 italic">{delivery.note}</p>
                )}
              </ReviewSection>

              <div className="border border-zinc-800 p-4">
                <div className="mb-4 text-xs font-medium tracking-widest text-zinc-500 uppercase">
                  Artikli ({items.length})
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.key} className="flex items-center gap-3">
                      <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-zinc-900">
                        {item.image && (
                          <PayloadImage media={item.image} fill className="object-cover" sizes="48px" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-white">{item.title}</div>
                        {item.selectedOptions.length > 0 && (
                          <div className="text-xs text-zinc-600">
                            {item.selectedOptions.map((o) => o.label).join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-xs text-zinc-500">×{item.quantity}</div>
                        <div className="text-sm text-white">
                          {formatCartPrice(item.unitPrice * item.quantity)} {CURRENCY.symbol}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placing}
                className="h-14 w-full bg-white text-xs font-medium tracking-widest text-black uppercase transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {placing ? 'Obrada porudžbine...' : 'Potvrdi porudžbinu'}
              </button>
              <BackLink onClick={() => setStep(2)} label="← Nazad" />
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="h-fit border border-zinc-800 bg-zinc-950 p-5">
          <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
            Sažetak
          </div>
          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-zinc-400 truncate">
                  {item.title}
                  <span className="ml-1 text-zinc-600">×{item.quantity}</span>
                </span>
                <span className="shrink-0 text-white">
                  {formatCartPrice(item.unitPrice * item.quantity)} {CURRENCY.symbol}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-zinc-900 pt-5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Subtotal</span>
              <span className="text-white">{formatCartPrice(subtotal)} {CURRENCY.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Dostava</span>
              <span className="text-white">{shippingCost === 0 ? 'Besplatno' : `${shippingCost} ${CURRENCY.symbol}`}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-900 pt-3 text-base font-semibold">
              <span className="text-white">Ukupno</span>
              <span className="text-white">{formatCartPrice(subtotal + shippingCost)} {CURRENCY.symbol}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Small helpers ---

const inputCls =
  'h-12 w-full border border-zinc-800 bg-zinc-950 px-4 text-sm text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none'

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium tracking-widest text-zinc-500 uppercase">
        {label}{required && <span className="ml-1 text-zinc-700">*</span>}
      </label>
      {children}
    </div>
  )
}

function StepActions({ children }) {
  return <div className="flex flex-col gap-3 pt-2">{children}</div>
}

function SubmitButton({ children }) {
  return (
    <button
      type="submit"
      className="h-12 w-full bg-white text-xs font-medium tracking-widest text-black uppercase transition-colors hover:bg-zinc-200"
    >
      {children}
    </button>
  )
}

function BackLink({ href, onClick, label }) {
  if (href) {
    return (
      <Link
        href={href}
        className="block text-center text-xs font-medium tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
      >
        {label}
      </Link>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full text-center text-xs font-medium tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
    >
      {label}
    </button>
  )
}

function ReviewSection({ title, onEdit, children }) {
  return (
    <div className="border border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">{title}</div>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
        >
          Izmeni
        </button>
      </div>
      {children}
    </div>
  )
}
