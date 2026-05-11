import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.topGrid}>
          {/* Column 1: Company Info */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Company info</h3>
            <ul className={styles.linkList}>
              <li><Link href="#" className={styles.link}>About Moomo</Link></li>
              <li><Link href="#" className={styles.link}>Affiliate & Influencer Program: Join to Earn</Link></li>
              <li><Link href="#" className={styles.link}>Contact us</Link></li>
              <li><Link href="#" className={styles.link}>Careers</Link></li>
              <li><Link href="#" className={styles.link}>Press</Link></li>
              <li><Link href="#" className={styles.link}>Moomo's Tree Planting Program</Link></li>
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Customer service</h3>
            <ul className={styles.linkList}>
              <li><Link href="#" className={styles.link}>Return and refund policy</Link></li>
              <li><Link href="#" className={styles.link}>Intellectual property policy</Link></li>
              <li><Link href="#" className={styles.link}>Shipping info</Link></li>
              <li><Link href="#" className={styles.link}>Report suspicious activity</Link></li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Help</h3>
            <ul className={styles.linkList}>
              <li><Link href="#" className={styles.link}>Support center & FAQ</Link></li>
              <li><Link href="#" className={styles.link}>Safety center</Link></li>
              <li><Link href="#" className={styles.link}>Moomo purchase protection</Link></li>
              <li><Link href="#" className={styles.link}>Sitemap</Link></li>
              <li><Link href="#" className={styles.link}>Partner with Moomo</Link></li>
            </ul>
          </div>

          {/* Column 4: Download App & Social */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Download the Moomo App</h3>
            <div className={styles.downloadSection}>
              <div className={styles.featuresGrid}>
                <div className={styles.featureItem}><CheckCircle size={14} /> Price drop alerts</div>
                <div className={styles.featureItem}><CheckCircle size={14} /> Track orders any time</div>
                <div className={styles.featureItem}><CheckCircle size={14} /> Faster & more secure...</div>
                <div className={styles.featureItem}><CheckCircle size={14} /> Low stock items alerts</div>
                <div className={styles.featureItem}><CheckCircle size={14} /> Exclusive offers</div>
                <div className={styles.featureItem}><CheckCircle size={14} /> Coupons & offers alerts</div>
              </div>
              <div className={styles.appButtons}>
                <Link href="#" className={styles.appButton}>
                  <svg viewBox="0 0 384 512" width="24" height="24" fill="white">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.1-44.6-35.9-2.8-74.3 22.7-93.1 22.7-18.9 0-46.5-22.1-76-22.1-40.8-.6-78.5 24-99.7 61.2-43.1 76.5-11 187.6 30.7 248.8 20.3 29.8 44.5 63.3 76.2 62.1 30.5-1.2 42.6-19.9 79.5-19.9 36.6 0 47.9 20 79.5 19.9 32.7-.2 54.4-31.5 74.3-61.2 23-34.1 32.5-67.2 32.9-68.9-1.2-.5-70-26.4-70.2-113.2zM245.5 83.1c16.9-20.7 28.3-49.4 25.2-78.1-24.6 1-54.3 16.5-72 37.3-14.3 16.7-27.5 46.2-23.7 74.3 27.2 2.1 53.6-12.8 70.5-33.5z"/>
                  </svg>
                  <div className={styles.appButtonText}>
                    <span className={styles.appButtonSmallText}>Download on the</span>
                    <span className={styles.appButtonLargeText}>App Store</span>
                  </div>
                </Link>
                <Link href="#" className={styles.appButton}>
                  <svg viewBox="0 0 512 512" width="24" height="24">
                    <path fill="#2196F3" d="M47.7 27.4c-2.3 2.5-3.7 6.4-3.7 11.5v434.3c0 5.1 1.4 9 3.7 11.5l.8.8L281.3 253 48.5 26.6z"/>
                    <path fill="#4CAF50" d="M360.7 332.4 281.3 253l-79.4 79.4 125.7 71.5c41.3 23.5 82.5 11.8 82.5-11.8v-59.7z"/>
                    <path fill="#FFC107" d="M360.7 179.6v59.7c0 23.5-41.3 35.3-82.5 11.8L152.5 179.6 281.3 253z"/>
                    <path fill="#F44336" d="M360.7 179.6 281.3 253l-232.8-226.4c-12.4-12.1-32.9-1.1-32.9 16.7v30.4l345.1 196.4z"/>
                  </svg>
                  <div className={styles.appButtonText}>
                    <span className={styles.appButtonSmallText}>Get it on</span>
                    <span className={styles.appButtonLargeText}>Google Play</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className={styles.socialSection}>
              <h3 className={styles.columnTitle} style={{ marginBottom: '0' }}>Connect with Moomo</h3>
              <div className={styles.socialIcons}>
                <Link href="#" className={styles.socialIcon} aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </Link>
                <Link href="#" className={styles.socialIcon} aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </Link>
                <Link href="#" className={styles.socialIcon} aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </Link>
                <Link href="#" className={styles.socialIcon} aria-label="Youtube">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.middleSection}>
          <div className={styles.certSection}>
            <h3 className={styles.columnTitle}>Security certification</h3>
            <div className={styles.badgeGrid}>
              <div className={styles.badge}>PCI</div>
              <div className={styles.badge} style={{ color: '#1a1f71' }}>VISA</div>
              <div className={styles.badge} style={{ color: '#eb001b' }}>Mastercard</div>
              <div className={styles.badge} style={{ color: '#2e77bc' }}>AMEX</div>
              <div className={styles.badge} style={{ color: '#ff6000' }}>Discover</div>
              <div className={styles.badge} style={{ color: '#003975' }}>JCB</div>
              <div className={styles.badge} style={{ color: '#19b419' }}>APWG</div>
            </div>
          </div>
          <div className={styles.paymentSection}>
            <h3 className={styles.columnTitle}>We accept</h3>
            <div className={styles.badgeGrid}>
              <div className={styles.badge} style={{ color: '#1a1f71' }}>VISA</div>
              <div className={styles.badge} style={{ color: '#eb001b' }}>Mastercard</div>
              <div className={styles.badge} style={{ color: '#2e77bc' }}>AMEX</div>
              <div className={styles.badge} style={{ color: '#ff6000' }}>Discover</div>
              <div className={styles.badge}>Maestro</div>
              <div className={styles.badge}>Diners</div>
              <div className={styles.badge} style={{ color: '#003975' }}>JCB</div>
              <div className={styles.badge} style={{ background: '#000', color: '#fff' }}>Apple Pay</div>
              <div className={styles.badge} style={{ background: '#000', color: '#fff' }}>G Pay</div>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div>&copy; 2022 - 2026 Moomo Inc.</div>
          <div className={styles.bottomLinks}>
            <Link href="#" className={styles.bottomLink}>Terms of use</Link>
            <Link href="#" className={styles.bottomLink}>Privacy policy</Link>
            <Link href="#" className={styles.bottomLink}>Your privacy choices</Link>
            <Link href="#" className={styles.bottomLink}>Ad Choices</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
