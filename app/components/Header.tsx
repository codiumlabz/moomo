"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Download, Globe, User, ShoppingCart, Menu, ChevronDown, LogOut, Bird, Cat, Dog, Fish, Rabbit, Snail, Turtle, Bug, TreePine, TreeDeciduous } from 'lucide-react';
import styles from './Header.module.css';
import Image from 'next/image';
import SignInPopup from './SignInPopup';
import { createClient } from '@/utils/supabase/client';

const avatarIcons = [Bird, Cat, Dog, Fish, Rabbit, Snail, Turtle, Bug, TreePine, TreeDeciduous];

export default function Header() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    }
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const isAuthenticated = !!user;
  const displayName = user?.user_metadata?.name || user?.email || 'Account';
  const avatarUrl = user?.user_metadata?.avatar_url;

  const AvatarIcon = useMemo(() => {
    if (!user) return User;
    const str = user.id || user.email || '';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % avatarIcons.length;
    return avatarIcons[index];
  }, [user]);

  return (
    <header className={styles.headerWrapper}>
      <div className="container">
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.logo}>
            <Link href="/">
              <Image 
                src="/name.png" 
                alt="BudgetBuy Logo" 
                width={150} 
                height={40} 
                priority
                className={styles.logoImage}
                style={{ height: 'auto' }}
              />
            </Link>
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

            {/* Auth action item */}
            {isLoading ? (
              <div className={styles.actionItem}>
                <User size={20} className={styles.actionIcon} />
                <div className={styles.actionText}>
                  <span>Loading...</span>
                </div>
              </div>
            ) : isAuthenticated ? (
              <div className={styles.actionItem} style={{ cursor: 'pointer' }}>
                <Link href="/profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" style={{ width: 20, height: 20, borderRadius: '50%', marginRight: '8px' }} />
                  ) : (
                    <AvatarIcon size={20} className={styles.actionIcon} style={{ color: '#ff4747', marginRight: '8px' }} />
                  )}
                  <div className={styles.actionText}>
                    <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {displayName}
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              <div className={styles.actionItem} onClick={() => setIsSignInOpen(true)} style={{ cursor: 'pointer' }}>
                <User size={20} className={styles.actionIcon} />
                <div className={styles.actionText}>
                  <span>Welcome</span>
                  <span className={styles.actionTitle}>Sign in / Register</span>
                </div>
              </div>
            )}

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
            <a href="#">Women&apos;s Clothing</a>
            <a href="#">Men&apos;s Clothing</a>
            <a href="#">Toys &amp; Games</a>
            <a href="#" style={{display: 'flex', alignItems: 'center'}}>More <ChevronDown size={14} /></a>
          </nav>
        </div>
      </div>

      <SignInPopup isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </header>
  );
}
