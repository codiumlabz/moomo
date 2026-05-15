"use client";

import React, { useState } from "react";
import { X, Lock, AlertCircle, Loader2 } from "lucide-react";
import styles from "./PaymentModal.module.css";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPayment: (cardDetails: CardDetails) => Promise<void>;
  isLoading?: boolean;
}

export interface CardDetails {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  email: string;
  phone: string;
  address: string;
}

export default function PaymentModal({ isOpen, onClose, totalAmount, onPayment, isLoading = false }: PaymentModalProps) {
  const [formData, setFormData] = useState<CardDetails>({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    email: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      formattedValue = formattedValue.slice(0, 19); // 16 digits + 3 spaces
    }

    // Format CVV to max 4 digits
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    // Format expiry to MM/YY
    if (name === "expiryMonth" || name === "expiryYear") {
      formattedValue = value.replace(/\D/g, "");
      if (name === "expiryMonth") {
        formattedValue = formattedValue.slice(0, 2);
      } else if (name === "expiryYear") {
        formattedValue = formattedValue.slice(0, 2);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.cardholderName.trim()) {
      setError("Cardholder name is required");
      return false;
    }
    if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Card number must be 16 digits");
      return false;
    }
    if (!formData.expiryMonth || !formData.expiryYear) {
      setError("Expiry date is required");
      return false;
    }
    if (parseInt(formData.expiryMonth) > 12 || parseInt(formData.expiryMonth) < 1) {
      setError("Invalid expiry month (01-12)");
      return false;
    }
    if (formData.cvv.length < 3) {
      setError("CVV must be 3-4 digits");
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Valid email is required");
      return false;
    }
    if (formData.phone.replace(/\D/g, "").length < 10) {
      setError("Valid phone number is required");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Address is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await onPayment(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} disabled={isLoading}>
          <X size={24} />
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Payment Details</h2>
          <p className={styles.subtitle}>Enter your card information to complete the purchase</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Card Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Card Information</h3>
            
            <div className={styles.inputGroup}>
              <label>Cardholder Name</label>
              <input
                type="text"
                name="cardholderName"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Card Number</label>
              <div className={styles.cardNumberInput}>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  maxLength={19}
                  required
                />
                <Lock size={18} color="#999" />
              </div>
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label>Expiry Date</label>
                <div className={styles.expiryInputs}>
                  <input
                    type="text"
                    name="expiryMonth"
                    placeholder="MM"
                    value={formData.expiryMonth}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    maxLength={2}
                    required
                  />
                  <span>/</span>
                  <input
                    type="text"
                    name="expiryYear"
                    placeholder="YY"
                    value={formData.expiryYear}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    maxLength={2}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+94 77 123 4567"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Delivery Address</label>
              <input
                type="text"
                name="address"
                placeholder="123 Main St, City, Country"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.amountInfo}>
            <span>Total Amount</span>
            <span className={styles.amount}>LKR {totalAmount.toLocaleString()}</span>
          </div>

          <button
            type="submit"
            className={styles.payBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                Processing...
              </>
            ) : (
              `Pay LKR ${totalAmount.toLocaleString()}`
            )}
          </button>

          <p className={styles.securityNote}>
            <Lock size={14} />
            Your card information is secure and encrypted
          </p>
        </form>
      </div>
    </div>
  );
}
