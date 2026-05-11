"use client";

import React, { useEffect, useState } from 'react';
import { MessageSquare, Edit2, ChevronUp } from 'lucide-react';
import styles from './FloatingButtons.module.css';

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.floatingContainer}>
      <button className={styles.fab} aria-label="Messages">
        <MessageSquare size={20} />
        <span className={styles.fabText}>Messages</span>
      </button>
      <button className={styles.fab} aria-label="Feedback">
        <Edit2 size={20} />
        <span className={styles.fabText}>Feedback</span>
      </button>
      {showTop && (
        <button className={styles.fab} aria-label="Top" onClick={scrollToTop}>
          <ChevronUp size={20} />
          <span className={styles.fabText}>Top</span>
        </button>
      )}
    </div>
  );
}
