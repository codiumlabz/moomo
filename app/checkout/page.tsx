"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Lock, AlertCircle, Loader2, ChevronRight, ShoppingCart, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Checkout.module.css';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/app/context/CartContext';

interface FormData {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  email: string;
  phone: string;
  address: string;
}

const payHereScriptUrl = process.env.NEXT_PUBLIC_PAYHERE_SCRIPT_URL || 'https://www.payhere.lk/lib/payhere.js';

function injectPayHereScript(src: string, mark?: string) {
  if (typeof window === 'undefined') return;
  if (document.querySelector(`script[src="${src}"]`)) return;

  const s = document.createElement('script');
  s.src = src;
  s.type = 'text/javascript';
  s.async = false;
  s.defer = true;
  s.setAttribute('data-payhere-loader', mark || '1');
  s.onload = () => console.log('PayHere script loaded:', src);
  s.onerror = (e) => {
    console.error('Failed to load PayHere script:', e, 'src=', src);
  };
  document.body.appendChild(s);
}

function loadPayHereScript() {
  if (typeof window === 'undefined') return;
  if (document.querySelector('script[data-payhere-loader]')) return;
  injectPayHereScript(payHereScriptUrl);
}

function handlePayHereScriptError(event: Event) {
  console.error('PayHere script failed via next/script', event);
}

function generateOrderId() {
  return `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems } = useCart();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [payHereReady, setPayHereReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user?.email) {
          setFormData(prev => ({ ...prev, email: user.email || "" }));
        }
      } catch {} finally { setIsLoadingUser(false); }
    }
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    loadPayHereScript();
    let timer: number | null = null;
    let timeoutId: number | null = null;

    const checkReady = () => {
      if ((window as any).payhere) {
        setPayHereReady(true);
        console.log('PayHere is available on window.payhere');
        if (timer) window.clearInterval(timer);
        if (timeoutId) window.clearTimeout(timeoutId);
      }
    };

    timer = window.setInterval(checkReady, 500);
    // fail after 10s with a helpful error
    timeoutId = window.setTimeout(() => {
      if (!((window as any).payhere)) {
        console.error('PayHere did not initialize within 10s');
        setError('PayHere failed to initialize. Check network/CSP or try again later.');
      }
      if (timer) window.clearInterval(timer);
    }, 10000);

    return () => { subscription.unsubscribe(); if (timer) window.clearInterval(timer); if (timeoutId) window.clearTimeout(timeoutId); };
  }, [supabase.auth]);

  useEffect(() => {
    if (!isLoadingUser && items.length === 0) {
      router.push('/cart');
    }
  }, [isLoadingUser, items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    } else if (name === "expiryMonth" || name === "expiryYear") {
      formattedValue = value.replace(/\D/g, "").slice(0, 2);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.cardholderName.trim()) { setError("Cardholder name is required"); return false; }
    if (formData.cardNumber.replace(/\s/g, "").length !== 16) { setError("Card number must be 16 digits"); return false; }
    if (!formData.expiryMonth || !formData.expiryYear) { setError("Expiry date is required"); return false; }
    if (parseInt(formData.expiryMonth) > 12 || parseInt(formData.expiryMonth) < 1) { setError("Invalid expiry month (01-12)"); return false; }
    if (formData.cvv.length < 3) { setError("CVV must be 3-4 digits"); return false; }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setError("Valid email is required"); return false; }
    if (formData.phone.replace(/\D/g, "").length < 10) { setError("Valid phone number is required"); return false; }
    if (!formData.address.trim()) { setError("Address is required"); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsProcessing(true);

    try {
      if (!payHereReady) {
        throw new Error('PayHere is not ready yet. Please try again in a moment.');
      }
      const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
      if (!merchantId) {
        throw new Error('PayHere merchant ID is not configured.');
      }

      const firstName = formData.cardholderName.trim().split(' ')[0] || 'Customer';
      const lastName = formData.cardholderName.trim().split(' ').slice(1).join(' ') || 'Customer';
      const orderId = generateOrderId();
      const itemsList = items.map((item) => `${item.name} x ${item.qty}`).join(', ');

      const payload: Record<string, any> = {
        sandbox: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX !== 'false',
        merchant_id: merchantId,
        return_url: `${window.location.origin}/payment-success?order_id=${encodeURIComponent(orderId)}`,
        cancel_url: `${window.location.origin}/cart`,
        order_id: orderId,
        items: itemsList,
        amount: totalPrice.toFixed(2),
        currency: 'LKR',
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: '',
        country: 'Sri Lanka',
        delivery_address: formData.address,
        delivery_city: '',
        delivery_country: 'Sri Lanka',
        custom_1: '',
        custom_2: '',
      };

      (window as any).payhere.startPayment(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (isLoadingUser || items.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.loadingContainer}>
          <Loader2 size={32} className={styles.spinner} />
          <p>Loading checkout...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.main}>
        <div className={styles.authPrompt}>
          <ShoppingCart size={48} strokeWidth={1} />
          <h2>Sign in to continue checkout</h2>
          <p>Please sign in to complete your purchase.</p>
          <Link href="/cart"><button className={styles.backBtn}>Back to Cart</button></Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Script
        src={payHereScriptUrl}
        strategy="afterInteractive"
        data-payhere-loader="1"
        onLoad={() => console.log('PayHere script loaded via next/script')}
        onError={handlePayHereScriptError}
      />
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Image src="/name.png" alt="Moomo" width={100} height={30} priority style={{ objectFit: 'contain', height: 'auto' }} />
          </Link>
          <div className={styles.breadcrumb}>
            <Link href="/cart">Cart</Link>
            <ChevronRight size={14} />
            <span>Checkout</span>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Checkout</h1>

        <div className={styles.layout}>
          <div className={styles.formColumn}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Card Information</h2>
                <div className={styles.inputGroup}>
                  <label>Cardholder Name</label>
                  <input type="text" name="cardholderName" placeholder="John Doe" value={formData.cardholderName} onChange={handleInputChange} disabled={isProcessing} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Card Number</label>
                  <div className={styles.cardNumberWrap}>
                    <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={handleInputChange} disabled={isProcessing} maxLength={19} required />
                    <Lock size={18} className={styles.lockIcon} />
                  </div>
                </div>
                <div className={styles.rowInputs}>
                  <div className={styles.inputGroup}>
                    <label>Expiry Date</label>
                    <div className={styles.expiryInputs}>
                      <input type="text" name="expiryMonth" placeholder="MM" value={formData.expiryMonth} onChange={handleInputChange} disabled={isProcessing} maxLength={2} required />
                      <span className={styles.expirySep}>/</span>
                      <input type="text" name="expiryYear" placeholder="YY" value={formData.expiryYear} onChange={handleInputChange} disabled={isProcessing} maxLength={2} required />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>CVV</label>
                    <input type="text" name="cvv" placeholder="123" value={formData.cvv} onChange={handleInputChange} disabled={isProcessing} maxLength={4} required />
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact Information</h2>
                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleInputChange} disabled={isProcessing} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input type="tel" name="phone" placeholder="+94 77 123 4567" value={formData.phone} onChange={handleInputChange} disabled={isProcessing} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Delivery Address</label>
                  <input type="text" name="address" placeholder="123 Main St, City, Country" value={formData.address} onChange={handleInputChange} disabled={isProcessing} required />
                </div>
              </div>

              {error && (
                <div className={styles.errorBanner}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.mobileSummaryWrap}>
                <div className={styles.summaryCard}>
                  <h3 className={styles.summaryCardTitle}>Order Summary</h3>
                  {items.map((item) => (
                    <div key={item.id} className={styles.summaryItem}>
                      <span className={styles.summaryItemName}>{item.name} <span className={styles.summaryItemQty}>x{item.qty}</span></span>
                      <span>LKR {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className={styles.summaryDivider} />
                  <div className={styles.summaryTotal}>
                    <span>Total</span>
                    <span>LKR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button type="submit" className={styles.payBtn} disabled={isProcessing}>
                {isProcessing ? (
                  <><Loader2 size={18} className={styles.spinner} /> Processing...</>
                ) : (
                  `Pay LKR ${totalPrice.toLocaleString()}`
                )}
              </button>

              <p className={styles.securityNote}>
                <Lock size={14} />
                Your card information is secure and encrypted
              </p>
            </form>
          </div>

          <div className={styles.summaryColumn}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryCardTitle}>Order Summary</h3>
              {items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span className={styles.summaryItemName}>{item.name} <span className={styles.summaryItemQty}>x{item.qty}</span></span>
                  <span>LKR {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className={styles.summaryDivider} />
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span className={styles.freeShipping}>Free</span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>LKR {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.badgesCard}>
              <h4 className={styles.badgesTitle}>
                <ShieldCheck size={16} /> Safe Payment
              </h4>
              <p className={styles.badgesDesc}>
                Moomo is committed to protecting your payment information. We follow PCI DSS standards and use strong encryption.
              </p>
              <div className={styles.paymentMethods}>
                <div className={styles.paymentLabel}>Payment methods</div>
                <div className={styles.paymentIcons}>
                  {['VISA', 'MC', 'AMEX', 'DISC', 'Maestro', 'JCB', 'Apple', 'GPay'].map(p => (
                    <div key={p} className={styles.paymentIconBox}>{p}</div>
                  ))}
                </div>
              </div>
              <div className={styles.paymentMethods}>
                <div className={styles.paymentLabel}>Security certification</div>
                <div className={styles.paymentIcons}>
                  {['PCI DSS', 'Visa Secure', 'ID Check', 'SafeKey', 'J/Secure'].map(p => (
                    <div key={p} className={styles.paymentIconBox}>{p}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
