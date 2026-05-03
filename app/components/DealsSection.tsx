"use client";

import React from 'react';
import { ChevronRight, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import styles from './DealsSection.module.css';

const CATEGORIES = [
  "Recommended", "Beauty & Health", "Women's Clothing", "Home & Kitchen",
  "Men's Clothing", "Women's Shoes", "Men's Underwear & Sleepwear",
  "Sports & Outdoors", "Office & School Supplies", "Toys & Games"
];

const PRODUCTS = [
  {
    id: 1,
    imageClass: styles.p1,
    title: "Men's Canvas Backpack, Black, M...",
    deal: true,
    price: "1,112.33",
    oldPrice: "2,432.42",
    sold: "250K+",
    tag: "Best-Selling Item",
    tagDesc: "in Men's Shoulder Bags",
    rating: 4.8,
    reviews: "13,578"
  },
  {
    id: 2,
    imageClass: styles.p2,
    title: "8pcs Mandala Coasters, Wooden Coaster S...",
    deal: false,
    price: "882.19",
    oldPrice: "1,553.43",
    sold: "100K+",
    tag: "Best-Selling Item",
    tagDesc: "in Dining & Entertaini...",
    rating: 4.9,
    reviews: "8,357"
  },
  {
    id: 3,
    imageClass: styles.p3,
    title: "1 Set Professional Electric Engraving Hair C...",
    deal: false,
    price: "1,610.96",
    oldPrice: "4,020.34",
    sold: "700K+",
    tag: "Best-Selling Item",
    tagDesc: "in Hair Care",
    rating: 4.6,
    reviews: "23,404"
  },
  {
    id: 4,
    imageClass: styles.p4,
    title: "Cartoon LED Table Lamp Button Battery Po...",
    deal: false,
    price: "1,221.01",
    oldPrice: "2,060.02",
    sold: "76K+",
    tag: "Top Rated",
    tagDesc: "in Lighting & Accessories",
    rating: 4.9,
    reviews: "6,631"
  },
  {
    id: 5,
    imageClass: styles.p5,
    title: "20-Piece Mixed Color Small Hair Claws for ...",
    deal: false,
    price: "942.92",
    oldPrice: "1,067.58",
    sold: "100K+",
    tag: "Best-Selling Item",
    tagDesc: "in Hair Accessories",
    rating: 4.7,
    reviews: "8,457"
  }
];

export default function DealsSection() {
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
          {PRODUCTS.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block', minWidth: 0 }}>
              <div className={styles.productCard}>
                <div className={`${styles.productImage} ${product.imageClass}`}></div>
                
                <div className={styles.productInfo}>
                  <div className={styles.titleRow}>
                    {product.deal && <span className={styles.dealBadge}>DEAL</span>}
                    <span className={styles.productTitle}>{product.title}</span>
                  </div>
                  
                  <div className={styles.priceRow}>
                    <div className={styles.priceLeft}>
                      <span className={styles.currency}>LKR</span>
                      <span className={styles.currentPrice}>{product.price}</span>
                      <span className={styles.oldPrice}>{product.oldPrice}</span>
                      <span className={styles.soldCount}>🔥 {product.sold} sold</span>
                    </div>
                    <button className={styles.cartBtn} onClick={(e) => e.preventDefault()}>
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                  
                  <div className={styles.tagRow}>
                    <span className={product.tag === 'Top Rated' ? styles.tagTop : styles.tagBest}>
                      {product.tag}
                    </span>
                    <span className={styles.tagDesc}>{product.tagDesc}</span>
                  </div>
                  
                  <div className={styles.ratingRow}>
                    <div className={styles.stars}>
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                    </div>
                    <span className={styles.reviewCount}>{product.reviews}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  );
}
