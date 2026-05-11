"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, Truck, PackageCheck, Smartphone, Lock, User, ShoppingCart, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Cart.module.css';
import SignInPopup from '../components/SignInPopup';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

function getInitials(name: string) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 45%)`;
}

export default function CartPage() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error('Error getting user:', err);
      } finally {
        setIsLoading(false);
      }
    }
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const isAuthenticated = !!user;
  const displayName = user?.user_metadata?.name || user?.email || 'Account';
  const avatarBg = user ? stringToColor(user.id || user.email || '') : '#ccc';
  const initials = getInitials(displayName);

  // Dummy products for the explore section
  const exploreProducts = [
    { id: 101, title: 'Wireless Headphones, HiFi Stereo', price: '2,450.00', imageClass: styles.p1 },
    { id: 102, title: 'Fashion Hair Drying Hat', price: '450.00', imageClass: styles.p2 },
    { id: 103, title: 'Vintage Shoulder Bag', price: '3,200.00', imageClass: styles.p3 },
    { id: 104, title: 'Wooden Wall Art Decor', price: '1,800.00', imageClass: styles.p4 },
  ];

  return (
    <main className={styles.main}>
      {/* Top Banner (reused from product view) */}
      <div className={styles.topBanner}>
        <div className={styles.bannerSection}>
          <div className={styles.bannerIcon}>
            <Truck size={24} color="#a4f4a4" />
          </div>
          <div className={styles.bannerTextContent}>
            <div className={`${styles.bannerTitle} ${styles.textGreen}`}>
              Free shipping <ChevronRight size={14} />
            </div>
            <div className={`${styles.bannerSubtitle} ${styles.textGreen}`}>
              Special for you
            </div>
          </div>
        </div>

        <div className={styles.bannerDivider}></div>

        <div className={styles.bannerSection}>
          <div className={styles.bannerIcon}>
            <PackageCheck size={24} color="#ffe7a0" />
          </div>
          <div className={styles.bannerTextContent}>
            <div className={`${styles.bannerTitle} ${styles.textYellow}`}>
              Delivery guarantee
            </div>
            <div className={`${styles.bannerSubtitle} ${styles.textWhite}`}>
              Refund for any issues
            </div>
          </div>
        </div>

        <div className={styles.bannerDivider}></div>

        <div className={styles.bannerSection}>
          <div className={styles.bannerIcon}>
            <Smartphone size={24} color="#ffe7a0" />
          </div>
          <div className={styles.bannerTextContent}>
            <div className={`${styles.bannerTitle} ${styles.textYellow}`}>
              Get the Moomo App
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Cart Header */}
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
            <div className={styles.headerRight}>
              <User size={18} />
              <span>Loading...</span>
            </div>
          ) : isAuthenticated ? (
            <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.headerRight}>
                <span style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: avatarBg,
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  marginRight: 4,
                  flexShrink: 0,
                }}>
                  {initials}
                </span>
                <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </span>
              </div>
            </Link>
          ) : (
            <div className={styles.headerRight} onClick={() => setIsSignInOpen(true)}>
              <User size={18} />
              <span>Sign in / Register</span>
            </div>
          )}
        </div>
      </header>

      {/* Cart Content */}
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <span style={{color: '#333'}}>Cart</span>
        </div>

        <div className={styles.cartLayout}>
          {/* Left Column */}
          <div className={styles.cartColumn}>
            {/* Alert */}
            <div className={styles.shippingAlert}>
              <Truck size={20} color="#111" />
              <span>Free shipping (excluding items shipped by local warehouses)</span>
            </div>

            {/* Empty State */}
            <div className={styles.emptyCart}>
              <ShoppingCart size={80} strokeWidth={1} className={styles.emptyCartIcon} />
              <h2 className={styles.emptyCartTitle}>Your shopping cart is empty</h2>
              <p className={styles.emptyCartDesc}>Add your favorite items in it.</p>
              
              {!isAuthenticated && (
                <button className={styles.primaryBtn} onClick={() => setIsSignInOpen(true)}>
                  Sign in / Register
                </button>
              )}
              <Link href="/">
                <button className={styles.secondaryBtn}>
                  Start shopping
                </button>
              </Link>
            </div>

            {/* Explore Picks */}
            <div className={styles.exploreSection}>
              <h3 className={styles.exploreTitle}>Explore Moomo's picks</h3>
              <div className={styles.productsGrid}>
                {exploreProducts.map(product => (
                  <Link href={`/product/${product.id}`} key={product.id} style={{textDecoration: 'none', display: 'block', minWidth: 0}}>
                    <div className={styles.productCard}>
                      <div className={`${styles.productImage} ${product.imageClass}`}></div>
                      <div className={styles.productInfo}>
                        <div className={styles.productTitle}>{product.title}</div>
                        <div className={styles.productPrice}>LKR {product.price}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className={styles.summaryColumn}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Total</span>
                <span className={styles.summaryValue}>LKR 0.00</span>
              </div>
              <p className={styles.summaryNote}>Please refer to your final actual payment amount.</p>
              
              <button className={styles.checkoutBtn}>
                Checkout (0)
              </button>

              <div className={styles.securityNotice}>
                <Lock size={16} color="#00a650" style={{flexShrink: 0, marginTop: '2px'}} />
                <span>You will not be charged until you review this order on the next page</span>
              </div>

              <div className={styles.safePaymentTitle}>
                <ShieldCheck size={18} color="white" fill="#00a650" /> Safe Payment Options
              </div>
              <p className={styles.safePaymentDesc}>
                <span className={styles.safePaymentHighlight}>Moomo is committed to protecting your payment information.</span> We follow PCI DSS standards, use strong encryption, and perform regular reviews of its system to protect your privacy.
              </p>

              <div className={styles.paymentSection}>
                <div className={styles.paymentLabel}>1. Payment methods</div>
                <div className={styles.paymentIcons}>
                  {['VISA', 'MC', 'AMEX', 'DISC', 'Maestro', 'Diners', 'JCB', 'Apple', 'GPay'].map(p => (
                    <div key={p} className={styles.paymentIconBox}>{p}</div>
                  ))}
                </div>
              </div>

              <div className={styles.paymentSection}>
                <div className={styles.paymentLabel}>2. Security certification</div>
                <div className={styles.paymentIcons}>
                  {['PCI DSS', 'Visa Secure', 'ID Check', 'SafeKey', 'ProtectBuy', 'J/Secure'].map(p => (
                    <div key={p} className={styles.paymentIconBox}>{p}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SignInPopup isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </main>
  );
}
