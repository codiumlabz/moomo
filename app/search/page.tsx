import Header from "../components/Header";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import styles from "./SearchPage.module.css";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch filtered products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("created_at", { ascending: false });

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className="container">
        <div className={styles.searchHeader}>
          <h1>
            {query ? `Search results for "${query}"` : "All Products"}
          </h1>
          <p>{products?.length || 0} items found</p>
        </div>

        <div className={styles.productsGrid}>
          {products && products.length > 0 ? (
            products.map((product) => (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className={styles.productCardLink}
              >
                <div className={styles.productCard}>
                  <div className={styles.productImage}>
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} />
                    ) : (
                      <div className={styles.noImg}>No Image</div>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.titleRow}>
                      {product.discount_price && (
                        <span className={styles.dealBadge}>DEAL</span>
                      )}
                      <span className={styles.productTitle}>{product.name}</span>
                    </div>

                    <div className={styles.priceRow}>
                      <div className={styles.priceLeft}>
                        <span className={styles.currency}>LKR</span>
                        <span className={styles.currentPrice}>
                          {(product.discount_price || product.price).toLocaleString()}
                        </span>
                        {product.discount_price && (
                          <span className={styles.oldPrice}>
                            {product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button className={styles.cartBtn}>
                        <ShoppingCart size={14} />
                      </button>
                    </div>

                    <div className={styles.ratingRow}>
                      <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                      <span className={styles.reviewCount}>0</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <h2>No products found</h2>
              <p>Try searching for something else or browse our categories.</p>
              <Link href="/" className={styles.backBtn}>
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
