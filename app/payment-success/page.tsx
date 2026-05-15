'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { CheckCircle2, AlertCircle, Home, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import styles from './PaymentSuccess.module.css'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'pending'>('loading')

  useEffect(() => {
    // Check payment status from query parameters
    const orderIdParam = searchParams.get('order_id')
    const paymentIdParam = searchParams.get('payment_id')
    const statusParam = searchParams.get('status')

    // PayHere returns status_code parameter
    // 2 = Success, others = Failed/Pending
    if (statusParam === '2' || orderIdParam) {
      setStatus('success')
    } else {
      setStatus('pending')
    }
  }, [searchParams])

  return (
    <div className={styles.card}>
      {status === 'loading' && (
        <>
          <div className={styles.loader} />
          <h1 className={styles.title}>Processing Payment</h1>
          <p className={styles.message}>Please wait while we confirm your payment...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 size={80} className={styles.successIcon} />
          <h1 className={styles.title}>Payment Successful!</h1>
          <p className={styles.message}>
            Thank you for your purchase. Your order has been confirmed and will be processed soon.
          </p>
          <div className={styles.detailsBox}>
            <p>
              <span className={styles.label}>Order Status:</span>
              <span className={styles.status}>Confirmed</span>
            </p>
            <p>
              <span className={styles.label}>Next Step:</span>
              <span>You will receive an email confirmation shortly</span>
            </p>
          </div>
        </>
      )}

      {status === 'pending' && (
        <>
          <AlertCircle size={80} className={styles.warningIcon} />
          <h1 className={styles.title}>Payment Pending</h1>
          <p className={styles.message}>
            Your payment is being processed. Please check your email for confirmation.
          </p>
          <div className={styles.detailsBox}>
            <p>
              <span className={styles.label}>Order Status:</span>
              <span className={styles.statusPending}>Pending</span>
            </p>
            <p>
              <span className={styles.label}>Next Step:</span>
              <span>We'll notify you once payment is confirmed</span>
            </p>
          </div>
        </>
      )}

      <div className={styles.actions}>
        <Link href="/cart" className={styles.btn}>
          <ShoppingCart size={18} />
          Continue Shopping
        </Link>
        <Link href="/" className={styles.btnSecondary}>
          <Home size={18} />
          Home
        </Link>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Suspense
          fallback={
            <div className={styles.card}>
              <div className={styles.loader} />
              <h1 className={styles.title}>Loading...</h1>
            </div>
          }
        >
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </main>
  )
}
