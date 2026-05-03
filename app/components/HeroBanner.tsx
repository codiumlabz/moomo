import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  return (
    <div className={styles.bannerWrapper}>
      <div className={`container ${styles.bannerContent}`}>
        <div className={styles.leftContent}>
          <div className={styles.saleTimer}>
            Sale Starts in: 
            <div className={styles.timerBoxes}>
              <span className={styles.timerBox}>12</span>:
              <span className={styles.timerBox}>11</span>:
              <span className={styles.timerBox}>27</span>
            </div>
          </div>
          
          <h1 className={styles.title}>
            Coming in <span>24</span> hours 
            <div className={styles.arrowIcon}>
              <ChevronRight size={24} />
            </div>
          </h1>

          <div className={styles.couponsContainer}>
            <div className={styles.couponCard}>
              <div className={styles.couponAmount}>LKR19,712 OFF</div>
              <div className={styles.couponCondition}>orders LKR160,921.6+</div>
              <div className={styles.couponCode}>Code:CDSR08</div>
            </div>
            <div className={styles.couponCard}>
              <div className={styles.couponAmount}>LKR14,336 OFF</div>
              <div className={styles.couponCondition}>orders LKR117,913.6+</div>
              <div className={styles.couponCode}>Code:CDSR07</div>
            </div>
            <div className={styles.couponCard}>
              <div className={styles.couponAmount}>LKR8,960 OFF</div>
              <div className={styles.couponCondition}>orders LKR74,905.6+</div>
              <div className={styles.couponCode}>Code:CDSR06</div>
            </div>

            <div className={styles.trendCard}>
              <div className={styles.trendImagePlaceholder}></div>
              <div className={styles.trendInfo}>
                <span className={styles.trendTitle}>Fashion<br/>trends</span>
                <span className={styles.trendPrice}>LKR1,961.13</span>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder for the red shopping bag image */}
        <div className={styles.rightImagePlaceholder}>
          <div className={styles.rightImageText1}>1ST</div>
          <div className={styles.rightImageText2}>EVERY</div>
          <div className={styles.rightImageText2}>MONTH</div>
        </div>
      </div>
    </div>
  );
}
