"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ImagePlus, X, Loader2, Save } from "lucide-react";
import styles from "./ProductForm.module.css";

type Category = { id: string; name: string };

export default function ProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    shippingPrice: "0",
    isFreeShipping: true,
    qty: "0",
    allowComments: true,
    categoryId: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalImages = [...images, ...newFiles].slice(0, 6);
      
      setImages(totalImages);
      
      const newPreviews = totalImages.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls: string[] = [];

      // 1. Upload Images
      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      // 2. Save Product Data
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
          shipping_price: formData.isFreeShipping ? 0 : parseFloat(formData.shippingPrice),
          is_free_shipping: formData.isFreeShipping,
          quantity: parseInt(formData.qty),
          allow_comments: formData.allowComments,
          images: uploadedUrls,
          category_id: formData.categoryId || null,
        });

      if (insertError) throw insertError;

      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <div className={styles.mainFields}>
          <div className={styles.field}>
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Mandala Wooden Coaster Set"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={5}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detail the product features..."
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className={styles.select}
            >
              <option value="">— No category —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="price">Original Price (LKR)</label>
              <input
                id="price"
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="discountPrice">Discount Price (LKR)</label>
              <input
                id="discountPrice"
                type="number"
                step="0.01"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="qty">Quantity</label>
              <input
                id="qty"
                type="number"
                required
                value={formData.qty}
                onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Shipping</label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={formData.isFreeShipping ? styles.toggleActive : styles.toggle}
                  onClick={() => setFormData({ ...formData, isFreeShipping: true })}
                >
                  Free Shipping
                </button>
                <button
                  type="button"
                  className={!formData.isFreeShipping ? styles.toggleActive : styles.toggle}
                  onClick={() => setFormData({ ...formData, isFreeShipping: false })}
                >
                  Paid
                </button>
              </div>
            </div>
          </div>

          {!formData.isFreeShipping && (
            <div className={styles.field}>
              <label htmlFor="shippingPrice">Shipping Price (LKR)</label>
              <input
                id="shippingPrice"
                type="number"
                step="0.01"
                value={formData.shippingPrice}
                onChange={(e) => setFormData({ ...formData, shippingPrice: e.target.value })}
              />
            </div>
          )}

          <div className={styles.checkboxField}>
            <input
              id="allowComments"
              type="checkbox"
              checked={formData.allowComments}
              onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
            />
            <label htmlFor="allowComments">Allow User Comments/Reviews</label>
          </div>
        </div>

        <div className={styles.imageSection}>
          <label>Product Images (Max 6)</label>
          <div className={styles.imageGrid}>
            {previews.map((src, index) => (
              <div key={index} className={styles.imagePreview}>
                <img src={src} alt={`Preview ${index}`} />
                <button type="button" onClick={() => removeImage(index)} className={styles.removeImg}>
                  <X size={16} />
                </button>
              </div>
            ))}
            {previews.length < 6 && (
              <label className={styles.uploadBtn}>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} hidden />
                <ImagePlus size={24} />
                <span>Upload</span>
              </label>
            )}
          </div>
          <p className={styles.helperText}>Select up to 6 professional product images.</p>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? (
            <>
              <Loader2 className={styles.spin} size={20} />
              <span>Saving Product...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Add Product</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
