"use client";

import { useState } from "react";
import styles from "./ProductPage.module.css";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.galleryWrapper}>
        <div className={styles.mainImageContainer}>
          <div className={styles.mainImagePlaceholder}>No Image Available</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.thumbnails}>
        {images.map((url, idx) => (
          <div
            key={idx}
            className={`${styles.thumbnail} ${idx === activeIdx ? styles.activeThumb : ""}`}
            onClick={() => setActiveIdx(idx)}
          >
            <img src={url} alt={`${name} thumbnail ${idx}`} className={styles.thumbImg} />
          </div>
        ))}
      </div>
      <div className={styles.mainImageContainer}>
        <img src={images[activeIdx]} alt={name} className={styles.mainImg} />
      </div>
    </div>
  );
}
