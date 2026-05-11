import ProductForm from "./ProductForm";
import styles from "./NewProduct.module.css";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function NewProductPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <div className={styles.container}>
      <Link href="/admin" className={styles.backLink}>
        <ChevronLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>
      
      <header className={styles.header}>
        <h1>Add New Product</h1>
        <p>Fill in the details below to list a new product on Moomo.</p>
      </header>

      <ProductForm categories={categories || []} />
    </div>
  );
}
