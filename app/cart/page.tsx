"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, Truck, PackageCheck, Smartphone, Lock, User, ShoppingCart, ShieldCheck, Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Cart.module.css';
import SignInPopup from '../components/SignInPopup';
import PaymentModal, { CardDetails } from '../components/PaymentModal';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/app/context/CartContext';

function getInitials(name: string) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash % 360)}, 70%, 45%)`;
}

function loadPayHereScript() {
  const src = 'https://sandbox.payhere.lk/pay/payhere.js';
  if (typeof window === 'undefined') return;
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
}

function generateOrderId() {
  return `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function CartPage() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [payHereReady, setPayHereReady] = useState(false);
  const { items, removeItem, updateQty, totalItems, totalPrice } = useCart();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch {}
      finally { setIsLoading(false); }
    }
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    loadPayHereScript();
    if (typeof window !== 'undefined') {
      const payhereReadyTimer = window.setInterval(() => {
        if ((window as any).payhere) {
          setPayHereReady(true);
          window.clearInterval(payhereReadyTimer);
        }
      }, 200);
      return () => {
        subscription.unsubscribe();
        window.clearInterval(payhereReadyTimer);
      };
    }
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleCheckoutClick = () => {
    if (!user) {
      setIsSignInOpen(true);
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePayment = async (cardDetails: CardDetails) => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      if (!payHereReady) {
        throw new Error('PayHere is not ready yet. Please try again in a moment.');
      }

      const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
      if (!merchantId) {
        throw new Error('PayHere merchant ID is not configured.');
      }

      const firstName = cardDetails.cardholderName.trim().split(' ')[0] || 'Customer';
      const lastName = cardDetails.cardholderName.trim().split(' ').slice(1).join(' ') || 'Customer';
      const orderId = generateOrderId();
      const itemsList = items.map((item) => `${item.name} x ${item.qty}`).join(', ');

      const payload: Record<string, string> = {
        sandbox: 'true',
        merchant_id: merchantId,
        return_url: `${window.location.origin}/payment-success?order_id=${encodeURIComponent(orderId)}`,
        cancel_url: `${window.location.origin}/cart`,
        order_id: orderId,
        items: itemsList,
        amount: totalPrice.toFixed(2),
        currency: 'LKR',
        first_name: firstName,
        last_name: lastName,
        email: cardDetails.email,
        phone: cardDetails.phone,
        address: cardDetails.address,
        city: '',
        country: 'Sri Lanka',
        delivery_address: cardDetails.address,
        delivery_city: '',
        delivery_country: 'Sri Lanka',
        custom_1: '',
        custom_2: '',
      };

      (window as any).payhere.startPayment(payload);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const isAuthenticated = !!user;
  const displayName = user?.user_metadata?.name || user?.email || 'Account';
  const avatarBg = user ? stringToColor(user.id || user.email || '') : '#ccc';
  const initials = getInitials(displayName);

  return (
    <main className={styles.main}>
      {/* Top Banner */}
      <div className={styles.topBanner}>
        <div className={styles.bannerSection}>
          <div className={styles.bannerIcon}><Truck size={24} color="#a4f4a4" /></div>
          <div className={styles.bannerTextContent}>
            <div className={`${styles.bannerTitle} ${styles.textGreen}`}>Free shipping <ChevronRight size={14} /></div>
            <div className={`${styles.bannerSubtitle} ${styles.textGreen}`}>Special for you</div>
          </div>
        </div>
        <div className={styles.bannerDivider} />
        <div className={styles.bannerSection}>
          <div className={styles.bannerIcon}><PackageCheck size={24} color="#ffe7a0" /></div>
          <div className={styles.bannerTextContent}>
            <div className={`${styles.bannerTitle} ${styles.textYellow}`}>Delivery guarantee</div>
            <div className={`${styles.bannerSubtitle} ${styles.textWhite}`}>Refund for any issues</div>
          </div>
        </div>
        <div className={styles.bannerDivider} />
        <div className={styles.bannerSection}>
          <div className={styles.bannerIcon}><Smartphone size={24} color="#ffe7a0" /></div>
          <div className={styles.bannerTextContent}>
            <div className={`${styles.bannerTitle} ${styles.textYellow}`}>Get the Moomo App</div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={styles.headerWrapper}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className={styles.logoBox}>
                <Image src="/name.png" alt="Moomo" width={100} height={30} priority style={{ objectFit: 'contain', height: 'auto' }} />
              </div>
            </Link>
            <div className={styles.safeguard}>
              <Lock size={16} color="#00a650" />
              <span>All data is safeguarded</span>
            </div>
          </div>
          {isLoading ? (
            <div className={styles.headerRight}><User size={18} /><span>Loading...</span></div>
          ) : isAuthenticated ? (
            <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.headerRight}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: avatarBg, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  {initials}
                </span>
                <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
              </div>
            </Link>
          ) : (
            <div className={styles.headerRight} onClick={() => setIsSignInOpen(true)}>
              <User size={18} /><span>Sign in / Register</span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className={styles.container}>

        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#333' }}>Cart</span>
        </div>

        <div className={styles.cartLayout}>
          {/* Left Column */}
          <div className={styles.cartColumn}>
            <div className={styles.shippingAlert}>
              <Truck size={20} color="#111" />
              <span>Free shipping (excluding items shipped by local warehouses)</span>
            </div>

            {items.length === 0 ? (
              <div className={styles.emptyCart}>
                <ShoppingCart size={80} strokeWidth={1} className={styles.emptyCartIcon} />
                <h2 className={styles.emptyCartTitle}>Your shopping cart is empty</h2>
                <p className={styles.emptyCartDesc}>Add your favorite items in it.</p>
                {!isAuthenticated && (
                  <button className={styles.primaryBtn} onClick={() => setIsSignInOpen(true)}>
                    Sign in / Register
                  </button>
                )}
                <Link href="/"><button className={styles.secondaryBtn}>Start shopping</button></Link>
              </div>
            ) : (
              <div className={styles.itemsList}>
                {items.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className={styles.itemImg} />
                      ) : (
                        <div className={styles.itemImgPlaceholder}><ShoppingCart size={24} /></div>
                      )}
                    </div>
                    <div className={styles.itemDetails}>
                      <Link href={`/product/${item.id}`} className={styles.itemName}>{item.name}</Link>
                      <div className={styles.itemPrice}>LKR {item.price.toLocaleString()}</div>
                      <div className={styles.itemControls}>
                        <div className={styles.qtyControls}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            disabled={item.qty <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className={styles.qtyValue}>{item.qty}</span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button className={styles.removeBtn} onClick={() => removeItem(item.id)} aria-label="Remove item">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className={styles.itemTotal}>
                      LKR {(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className={styles.summaryColumn}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Items ({totalItems})</span>
                <span className={styles.summaryValue}>LKR {totalPrice.toLocaleString()}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Shipping</span>
                <span style={{ color: '#00a650', fontWeight: 600 }}>Free</span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Total</span>
                <span className={styles.summaryValue}>LKR {totalPrice.toLocaleString()}</span>
              </div>
              <p className={styles.summaryNote}>Please refer to your final actual payment amount.</p>

              <button className={styles.checkoutBtn} disabled={items.length === 0} onClick={handleCheckoutClick}>
                Checkout ({totalItems})
              </button>

              <div className={styles.securityNotice}>
                <Lock size={16} color="#00a650" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>You will not be charged until you review this order on the next page</span>
              </div>

              <div className={styles.safePaymentTitle}>
                <ShieldCheck size={18} color="white" fill="#00a650" /> Safe Payment Options
              </div>
              <p className={styles.safePaymentDesc}>
                <span className={styles.safePaymentHighlight}>Moomo is committed to protecting your payment information.</span> We follow PCI DSS standards and use strong encryption.
              </p>

              <div className={styles.paymentSection}>
                <div className={styles.paymentLabel}>1. Payment methods</div>
                <div className={styles.paymentIcons}>
                  {['VISA', 'MC', 'AMEX', 'DISC', 'Maestro', 'JCB', 'Apple', 'GPay'].map(p => (
                    <div key={p} className={styles.paymentIconBox}>{p}</div>
                  ))}
                </div>
              </div>
              <div className={styles.paymentSection}>
                <div className={styles.paymentLabel}>2. Security certification</div>
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

      <SignInPopup isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => !isProcessing && setIsPaymentModalOpen(false)}
        totalAmount={totalPrice}
        onPayment={handlePayment}
        isLoading={isProcessing}
      />
    </main>
  );
}
