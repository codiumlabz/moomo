"use client";

import styles from './DealsSection.module.css';
import { createClient } from '@/utils/supabase/client';
import { ChevronRight, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/app/context/CartContext';

const CATEGORIES = [
  "Recommended", "Beauty & Health", "Women's Clothing", "Home & Kitchen",
  "Men's Clothing", "Women's Shoes", "Men's Underwear & Sleepwear",
  "Sports & Outdoors", "Office & School Supplies", "Toys & Games"
];


export default function DealsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsPromise = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(12);
        const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
          setTimeout(() => reject(new Error('Products fetch timeout')), 10000)
        );

        const { data, error } = await Promise.race([productsPromise, timeoutPromise]);

        if (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        } else if (data) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Fetch products error:', err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, []);
  return (
    <section className={styles.sectionWrapper}>
      <div className="container">
        
        {/* Header Section */}
        <div className={styles.headerArea}>
          <div className={styles.subTitle}>
            ☁️ <span className={styles.gradientText}>NEW SEASON, NEW YOU</span> ☁️
          </div>
          <h2 className={styles.mainTitle}>EXPLORE YOUR INTERESTS</h2>
        </div>

        {/* Categories */}
        <div className={styles.categoryScroll}>
          {CATEGORIES.map((cat, i) => (
            <button key={i} className={`${styles.categoryBtn} ${i === 0 ? styles.active : ''}`}>
              {cat}
            </button>
          ))}
          <button className={styles.nextCategoryBtn}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className={styles.productCard} style={{ opacity: 0.5, pointerEvents: 'none' }}>
                <div className={styles.productImage} style={{ backgroundColor: '#eee' }}></div>
                <div className={styles.productInfo}>
                  <div style={{ height: '20px', width: '100%', backgroundColor: '#eee', marginBottom: '10px' }}></div>
                  <div style={{ height: '20px', width: '60%', backgroundColor: '#eee' }}></div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block', minWidth: 0 }}>
                <div className={styles.productCard}>
                  <div className={styles.productImage}>
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className={styles.cardImg} />
                    ) : (
                      <div className={styles.noImg}>No Image</div>
                    )}
                  </div>
                  
                  <div className={styles.productInfo}>
                    <div className={styles.titleRow}>
                      {product.discount_price && <span className={styles.dealBadge}>DEAL</span>}
                      <span className={styles.productTitle}>{product.name}</span>
                    </div>
                    
                    <div className={styles.priceRow}>
                      <div className={styles.priceLeft}>
                        <span className={styles.currency}>LKR</span>
                        <span className={styles.currentPrice}>
                          {(product.discount_price || product.price).toLocaleString()}
                        </span>
                        {product.discount_price && (
                          <span className={styles.oldPrice}>{product.price.toLocaleString()}</span>
                        )}
                        <span className={styles.soldCount}>🔥 {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                      </div>
                      <button className={styles.cartBtn} onClick={(e) => {
                        e.preventDefault();
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.discount_price ?? product.price,
                          image: product.images?.[0] ?? "",
                        });
                      }}>
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                    
                    <div className={styles.tagRow}>
                      <span className={styles.tagBest}>
                        Best Value
                      </span>
                      <span className={styles.tagDesc}>in Category</span>
                    </div>
                    
                    <div className={styles.ratingRow}>
                      <div className={styles.stars}>
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                      </div>
                      <span className={styles.reviewCount}>0</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>No products found. Add some from the Admin Dashboard!</div>
          )}
        </div>
        
      </div>
    </section>
  );
}
