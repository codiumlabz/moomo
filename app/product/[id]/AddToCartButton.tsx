"use client";

import { useCart } from "@/app/context/CartContext";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import styles from "./ProductPage.module.css";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    discount_price: number | null;
    quantity: number;
    images: string[];
  };
  discountPercent: number;
};

export default function AddToCartButton({ product, discountPercent }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount_price ?? product.price,
      image: product.images?.[0] ?? "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.quantity === 0) {
    return (
      <button className={styles.addToCartBtn} disabled>
        Sold Out
      </button>
    );
  }

  return (
    <button className={styles.addToCartBtn} onClick={handleAdd}>
      {added ? (
        <><Check size={18} /> Added to cart!</>
      ) : discountPercent > 0 ? (
        `-${discountPercent}% now! Add to cart!`
      ) : (
        <><ShoppingCart size={18} /> Add to cart</>
      )}
    </button>
  );
}
