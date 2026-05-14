"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import styles from "./SignInPopup.module.css";
import { useRouter } from "next/navigation";
import { login, signup } from "../auth/actions";

interface SignInPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInPopup({ isOpen, onClose }: SignInPopupProps) {
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = step === "signIn" 
        ? await login(formData) 
        : await signup(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        // Success - refresh and close for both sign in and sign up
        router.refresh();
        onClose();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.popupContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.popupHeader}>
          <h2 className={styles.title}>
            {step === "signIn" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className={styles.subtitle}>
            {step === "signIn"
              ? "Enter your details to access your account."
              : "Sign up to get started with Moomo."}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {step === "signUp" && (
            <div className={styles.inputGroup}>
              <div className={styles.inputIcon}>
                <User size={18} />
              </div>
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                className={styles.input}
                required
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <Mail size={18} />
            </div>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <Lock size={18} />
            </div>
            <input
              name="password"
              type="password"
              placeholder="Password (min. 8 characters)"
              className={styles.input}
              required
              minLength={8}
            />
          </div>

          {error && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={18} className={styles.spinner} />
            ) : step === "signIn" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className={styles.switchMode}>
          <span>
            {step === "signIn"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <button
            type="button"
            onClick={() => {
              setStep(step === "signIn" ? "signUp" : "signIn");
              setError(null);
            }}
            className={styles.switchBtn}
          >
            {step === "signIn" ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
