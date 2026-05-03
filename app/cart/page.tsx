"use client";

import React, { useState } from 'react';
import { ChevronRight, Truck, PackageCheck, Smartphone, Lock, User, ShoppingCart, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import styles from './Cart.module.css';
import SignInPopup from '../components/SignInPopup';

export default function CartPage() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);

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
              Get the Shinshan App
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
                SHIN<br/>SHAN
              </div>
            </Link>
            <div className={styles.safeguard}>
              <Lock size={16} color="#00a650" />
              <span>All data is safeguarded</span>
            </div>
          </div>
          <div className={styles.headerRight} onClick={() => setIsSignInOpen(true)}>
            <User size={18} />
            <span>Sign in / Register</span>
          </div>
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
              
              <button className={styles.primaryBtn} onClick={() => setIsSignInOpen(true)}>
                Sign in / Register
              </button>
              <Link href="/">
                <button className={styles.secondaryBtn}>
                  Start shopping
                </button>
              </Link>
            </div>

            {/* Explore Picks */}
            <div className={styles.exploreSection}>
              <h3 className={styles.exploreTitle}>Explore Shinshan's picks</h3>
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
                <span className={styles.safePaymentHighlight}>Shinshan is committed to protecting your payment information.</span> We follow PCI DSS standards, use strong encryption, and perform regular reviews of its system to protect your privacy.
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
