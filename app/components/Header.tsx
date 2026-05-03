"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Download, Globe, User, ShoppingCart, Menu, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';
import Image from 'next/image';
import SignInPopup from './SignInPopup';

export default function Header() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  return (
    <header className={styles.headerWrapper}>
      <div className="container">
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.logo}>
            <Image 
              src="/name.png" 
              alt="BudgetBuy Logo" 
              width={150} 
              height={40} 
              priority
              className={styles.logoImage}
              style={{ height: 'auto' }}
            />
          </div>
          
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search for products, brands and more..." 
              className={styles.searchInput} 
            />
            <button className={styles.searchButton}>
              <Search size={18} />
            </button>
          </div>

          <div className={styles.actions}>
            <div className={styles.actionItem}>
              <Download size={20} className={styles.actionIcon} />
              <div className={styles.actionText}>
                <span>Download the</span>
                <span className={styles.actionTitle}>BudgetBuy app</span>
              </div>
            </div>

            <div className={styles.actionItem}>
              <Globe size={20} className={styles.actionIcon} />
              <div className={styles.actionText}>
                <span>EN /</span>
                <span className={styles.actionTitle}>LKR <ChevronDown size={12} style={{display:'inline'}}/></span>
              </div>
            </div>

            <div className={styles.actionItem} onClick={() => setIsSignInOpen(true)} style={{ cursor: 'pointer' }}>
              <User size={20} className={styles.actionIcon} />
              <div className={styles.actionText}>
                <span>Welcome</span>
                <span className={styles.actionTitle}>Sign in / Register</span>
              </div>
            </div>

            <Link href="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.actionItem} style={{ cursor: 'pointer' }}>
                <ShoppingCart size={24} className={styles.actionIcon} />
                <div className={styles.actionText}>
                  <span className={styles.cartBadge}>0</span>
                  <span className={styles.actionTitle}>Cart</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <button className={styles.categoriesBtn}>
            <Menu size={18} /> All Categories
          </button>
          
          <nav className={styles.navLinks}>
            <a href="#" className={styles.highlightedLink}>Bundle deals</a>
            <a href="#">Choice</a>
            <a href="#">Automotive</a>
            <a href="#">Appliances</a>
            <a href="#">Women's Clothing</a>
            <a href="#">Men's Clothing</a>
            <a href="#">Toys & Games</a>
            <a href="#" style={{display: 'flex', alignItems: 'center'}}>More <ChevronDown size={14} /></a>
          </nav>
        </div>
      </div>

      <SignInPopup isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </header>
  );
}
