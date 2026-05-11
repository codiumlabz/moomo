import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import CategoriesClient from "./CategoriesClient";

export default async function CategoriesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  return <CategoriesClient initialCategories={categories || []} />;
}
