import styles from './ProductPage.module.css';
import Link from 'next/link';
import Header from '../../components/Header';
import ProductGallery from './ProductGallery';
import CommentsSection from './CommentsSection';
import AddToCartButton from './AddToCartButton';
import { Share, Star, Check, ChevronRight, ShieldCheck, Truck, RotateCcw, ChevronDown, Smartphone, PackageCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    console.error('Error fetching product:', error?.message, '| id:', id);
    notFound();
  }

  const [{ data: comments }, { data: { user } }] = await Promise.all([
    supabase
      .from('comments')
      .select('id, rating, body, created_at, profiles(full_name)')
      .eq('product_id', id)
      .order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const currentPrice = product.discount_price || product.price;
  const discountPercent = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
    : 0;

  return (
    <main className={styles.main}>
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
      <Header />
      
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <Link href="#">Products</Link>
          <ChevronRight size={14} />
          <span className={styles.currentBreadcrumb}>{product.name}</span>
        </div>

        <div className={styles.productLayout}>
          {/* Left Column: Image Gallery and Reviews */}
          <div className={styles.galleryColumn}>
            <ProductGallery images={product.images || []} name={product.name} />

            {/* Reviews Section */}
            <CommentsSection
              productId={id}
              initialComments={(comments ?? []) as any}
              currentUserId={user?.id ?? null}
              allowComments={product.allow_comments}
            />
          </div>

          {/* Right Column: Product Details */}
          <div className={styles.detailsColumn}>
            <div className={styles.titleSection}>
              <h1 className={styles.productTitle}>
                {product.name} - {product.description.substring(0, 150)}...
              </h1>
              <button className={styles.shareBtn}>
                <Share size={20} />
              </button>
            </div>

            <div className={styles.statsRow}>
              <span className={styles.soldCount}>{product.quantity > 0 ? `${product.quantity} items left` : 'Out of Stock'}</span>
              <span className={styles.divider}>|</span>
              <span className={styles.soldBy}>Sold by Moomo Store <span className={styles.starSeller}><Star size={12} fill="white"/> Star seller <ChevronRight size={12} /></span></span>
              
              <div className={styles.ratingSection}>
                <span className={styles.ratingNumber}>4.8</span>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
              </div>
            </div>

            <div className={styles.bestSellingBadge}>
              <span className={styles.rankBadge}>#1 Best-Selling Item</span>
              <span className={styles.rankCategory}>in Dining & Entertaining <ChevronRight size={14} /></span>
            </div>

            <div className={styles.priceSection}>
              {product.discount_price && (
                <span className={styles.oldPrice}>{product.price.toLocaleString()}</span>
              )}
              <span className={styles.currency}>LKR</span>
              <span className={styles.newPrice}>{currentPrice.toLocaleString()}</span>
              {discountPercent > 0 && (
                <span className={styles.discountBadge}>{discountPercent}% OFF</span>
              )}
            </div>

            <div className={styles.shippingBanner}>
              <div className={styles.shippingText}>
                <Check size={16} color="#00a650" /> <strong>Free shipping</strong> <span className={styles.divider}>|</span> <Check size={16} color="#00a650" /> <span>LKR 319.67 Credit for delay</span> <ChevronRight size={16} />
              </div>
            </div>

            <div className={styles.quantitySection}>
              <span className={styles.qtyLabel}>Quantity: 8pcs</span>
              <div className={styles.qtySelectorWrapper}>
                <span className={styles.qtyText}>Qty</span>
                <button className={styles.qtySelector}>
                  1 <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                discount_price: product.discount_price,
                quantity: product.quantity,
                images: product.images,
              }}
              discountPercent={discountPercent}
            />

            <div className={styles.deliverySection}>
              <div className={styles.deliveryHeader}>
                <Truck size={20} color="#00a650" />
                <strong>Free shipping for this item <ChevronRight size={16} /></strong>
              </div>
              <div className={styles.deliveryDetails}>
                <p>Delivery: <strong>May 14-26</strong></p>
                <p className={styles.courier}>Courier company: 🚚 SKYNET 🟢 ZTO 🔴 ZTO 📦 SM Express ...</p>
              </div>
            </div>

            <div className={styles.guaranteeSection}>
              <div className={styles.guaranteeHeader}>
                <ShieldCheck size={20} color="#00a650" />
                <strong>Why choose Moomo? <ChevronRight size={16} /></strong>
              </div>
              
              <div className={styles.guaranteeGrid}>
                <div className={styles.guaranteeItem}>
                  <div className={styles.guaranteeTitle}>Security & Privacy</div>
                  <div className={styles.guaranteeDesc}><Check size={12} color="#00a650" /> Safe payments</div>
                  <div className={styles.guaranteeDesc}><Check size={12} color="#00a650" /> Secure privacy</div>
                </div>
                <div className={styles.guaranteeItem}>
                  <div className={styles.guaranteeTitle}>Delivery guarantee</div>
                  <div className={styles.guaranteeDesc}><Check size={12} color="#00a650" /> LKR 319.67 Credit for delay</div>
                  <div className={styles.guaranteeDesc}><Check size={12} color="#00a650" /> 29-day no update refund</div>
                </div>
                <div className={styles.guaranteeItem}>
                  <div className={styles.guaranteeTitle}>&nbsp;</div>
                  <div className={styles.guaranteeDesc}><Check size={12} color="#00a650" /> Return if item damaged</div>
                  <div className={styles.guaranteeDesc}><Check size={12} color="#00a650" /> 44-day no delivery refund</div>
                </div>
              </div>
            </div>
            
            <div className={styles.returnsSection}>
              <RotateCcw size={18} color="#00a650" />
              <strong>Free returns • Price adjustment <ChevronRight size={16} /></strong>
            </div>

            <div className={styles.plantingSection}>
              🌳 <strong>Moomo's Tree Planting Program (26M+ trees) <ChevronRight size={16} /></strong>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
