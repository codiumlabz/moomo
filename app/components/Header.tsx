"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Download, Globe, User, ShoppingCart, Menu, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';
import Image from 'next/image';
import SignInPopup from './SignInPopup';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
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
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 45%)`;
}

export default function Header() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      try {
        const userPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise<{ data: { user: null } }>((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 3000)
        );
        const { data: { user } } = await Promise.race([userPromise, timeoutPromise]);
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
  const { totalItems } = useCart();

  return (
    <header className={styles.headerWrapper}>
      <div className="container">
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.logo}>
            <Link href="/">
              <Image 
                src="/name.png" 
                alt="Moomo Logo" 
                width={150} 
                height={40} 
                priority
                className={styles.logoImage}
                style={{ height: 'auto' }}
              />
            </Link>
          </div>
          
          <form 
            className={styles.searchContainer}
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
          >
            <input 
              type="text" 
              placeholder="Search for products, brands and more..." 
              className={styles.searchInput} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>
              <Search size={18} />
            </button>
          </form>

          <div className={styles.actions}>
            <div className={styles.actionItem}>
              <Download size={20} className={styles.actionIcon} />
              <div className={styles.actionText}>
                <span>Download the</span>
                <span className={styles.actionTitle}>Moomo app</span>
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
                    marginRight: 8,
                    flexShrink: 0,
                  }}>
                    {initials}
                  </span>
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
                  <span className={styles.cartBadge}>{totalItems > 0 ? totalItems : 0}</span>
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
