import React from 'react';
import { MessageSquare, Edit2 } from 'lucide-react';
import styles from './FloatingButtons.module.css';

export default function FloatingButtons() {
  return (
    <div className={styles.floatingContainer}>
      <button className={styles.fab} aria-label="Chat">
        <MessageSquare size={20} />
      </button>
      <button className={styles.fab} aria-label="Feedback">
        <Edit2 size={20} />
      </button>
    </div>
  );
}
