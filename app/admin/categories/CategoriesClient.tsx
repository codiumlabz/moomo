"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Loader2, Tag } from "lucide-react";
import styles from "./Categories.module.css";

type Category = { id: string; name: string; created_at: string };

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    setError("");

    const { data, error: insertError } = await supabase
      .from("categories")
      .insert({ name: newName.trim() })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message.includes("unique") ? "Category already exists." : insertError.message);
    } else if (data) {
      setCategories([data, ...categories]);
      setNewName("");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error: deleteError } = await supabase.from("categories").delete().eq("id", id);
    if (!deleteError) {
      setCategories(categories.filter((c) => c.id !== id));
    }
    setDeletingId(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Categories</h1>
        <p>Manage product categories for your store.</p>
      </header>

      <form className={styles.addForm} onSubmit={handleAdd}>
        <div className={styles.inputRow}>
          <input
            type="text"
            placeholder="New category name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={styles.input}
          />
          <button type="submit" disabled={loading || !newName.trim()} className={styles.addBtn}>
            {loading ? <Loader2 size={18} className={styles.spin} /> : <Plus size={18} />}
            Add Category
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </form>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th><Tag size={14} /> Name</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className={styles.nameCell}>{cat.name}</td>
                <td>{new Date(cat.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(cat.id)}
                    disabled={deletingId === cat.id}
                    aria-label={`Delete ${cat.name}`}
                  >
                    {deletingId === cat.id
                      ? <Loader2 size={16} className={styles.spin} />
                      : <Trash2 size={16} />}
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className={styles.empty}>No categories yet. Add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
