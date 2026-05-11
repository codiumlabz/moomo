'use client'

import React, { useState } from 'react'
import { updateProfile } from '../actions'
import { signOut } from '@/app/auth/actions'
import { LogOut, User, MapPin, Phone, Package, Truck, Save, Loader2, CheckCircle } from 'lucide-react'
import styles from './ProfileDashboard.module.css'

type ProfileData = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone_1: string;
  phone_2: string;
  address: string;
  city: string;
  district: string;
  province: string;
  country: string;
  zipcode: string;
}

export default function ProfileDashboard({ initialProfile }: { initialProfile: ProfileData }) {
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'tracking'>('info')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await updateProfile(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarCard}>
          <div className={styles.userSummary}>
            <div className={styles.avatarContainer}>
              {initialProfile.avatar_url ? (
                <img src={initialProfile.avatar_url} alt="Profile Avatar" className={styles.avatarImage} />
              ) : (
                <User size={32} className={styles.iconLight} />
              )}
            </div>
            <h2 className={styles.userName}>{initialProfile.full_name || 'My Profile'}</h2>
            <p className={styles.userEmail}>{initialProfile.email}</p>
          </div>

          <nav className={styles.nav}>
            <button
              onClick={() => setActiveTab('info')}
              className={`${styles.navButton} ${activeTab === 'info' ? styles.navButtonActive : ''}`}
            >
              <User size={18} />
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${styles.navButton} ${activeTab === 'orders' ? styles.navButtonActive : ''}`}
            >
              <Package size={18} />
              Order History
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`${styles.navButton} ${activeTab === 'tracking' ? styles.navButtonActive : ''}`}
            >
              <Truck size={18} />
              Order Tracking
            </button>
          </nav>

          <div className={styles.signOutWrapper}>
            <button onClick={() => signOut()} className={styles.signOutButton}>
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.contentCard}>
          
          {/* --- PROFILE INFO TAB --- */}
          {activeTab === 'info' && (
            <div>
              <h1 className={styles.sectionTitle}>Personal Information</h1>
              
              {success && (
                <div className={styles.alertSuccess}>
                  <CheckCircle size={20} />
                  Profile updated successfully!
                </div>
              )}
              
              {error && (
                <div className={styles.alertError}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  {/* Basic Info */}
                  <div className={styles.inputWrapper}>
                    <label className={styles.label}>Full Name</label>
                    <input 
                      name="full_name"
                      defaultValue={initialProfile.full_name}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <label className={styles.label}>Email Address (Cannot be changed)</label>
                    <input 
                      value={initialProfile.email}
                      disabled
                      className={`${styles.input} ${styles.inputDisabled}`}
                    />
                  </div>

                  {/* Contact Numbers */}
                  <div className={styles.inputWrapper}>
                    <label className={styles.label}>
                      <Phone size={14} className={styles.iconLight} /> Primary Phone
                    </label>
                    <input 
                      name="phone_1"
                      defaultValue={initialProfile.phone_1}
                      placeholder="+94 77 123 4567"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <label className={styles.label}>
                      <Phone size={14} className={styles.iconLight} /> Secondary Phone
                    </label>
                    <input 
                      name="phone_2"
                      defaultValue={initialProfile.phone_2}
                      placeholder="+94 11 123 4567"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.sectionHeader}>
                  <h3 className={styles.subTitle}>
                    <MapPin size={20} className={styles.iconPrimary} /> Shipping Address
                  </h3>
                  
                  <div className={styles.formGroup}>
                    <div className={styles.inputWrapper}>
                      <label className={styles.label}>Street Address</label>
                      <input 
                        name="address"
                        defaultValue={initialProfile.address}
                        placeholder="123 Main Street, Apt 4B"
                        className={styles.input}
                      />
                    </div>
                    
                    <div className={styles.formGrid3}>
                      <div className={styles.inputWrapper}>
                        <label className={styles.label}>City</label>
                        <input 
                          name="city"
                          defaultValue={initialProfile.city}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.inputWrapper}>
                        <label className={styles.label}>District</label>
                        <input 
                          name="district"
                          defaultValue={initialProfile.district}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.inputWrapper}>
                        <label className={styles.label}>Province</label>
                        <input 
                          name="province"
                          defaultValue={initialProfile.province}
                          className={styles.input}
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formGrid}>
                      <div className={styles.inputWrapper}>
                        <label className={styles.label}>Country</label>
                        <input 
                          name="country"
                          defaultValue={initialProfile.country || "Sri Lanka"}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.inputWrapper}>
                        <label className={styles.label}>Postal / Zip Code</label>
                        <input 
                          name="zipcode"
                          defaultValue={initialProfile.zipcode}
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.submitWrapper}>
                  <button 
                    type="submit"
                    disabled={loading}
                    className={styles.submitBtn}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- ORDER HISTORY TAB --- */}
          {activeTab === 'orders' && (
            <div>
              <h1 className={styles.sectionTitle}>Order History</h1>
              <div className={styles.emptyState}>
                <Package size={48} className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>No orders yet</h3>
                <p className={styles.emptyStateDesc}>When you make a purchase, your order history will appear here.</p>
              </div>
            </div>
          )}

          {/* --- TRACKING TAB --- */}
          {activeTab === 'tracking' && (
            <div>
              <h1 className={styles.sectionTitle}>Order Tracking</h1>
              <div className={styles.emptyState}>
                <Truck size={48} className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>No active shipments</h3>
                <p className={styles.emptyStateDesc}>Active shipments and tracking information will be displayed here once your order is dispatched.</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
