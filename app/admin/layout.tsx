import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/auth/actions";
import Link from "next/link";
import styles from "./AdminLayout.module.css";
import { LayoutDashboard, PackagePlus, Users, LogOut, Home } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return redirect("/");
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Link href="/">Moomo Admin</Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products/new" className={styles.navLink}>
            <PackagePlus size={20} />
            <span>Add Product</span>
          </Link>
          <Link href="/admin/users" className={styles.navLink}>
            <Users size={20} />
            <span>Users</span>
          </Link>
        </nav>
        <div className={styles.footer}>
          <Link href="/" className={styles.navLink}>
            <Home size={20} />
            <span>Back to Site</span>
          </Link>
          <form action={signOut}>
            <button type="submit" className={styles.logoutBtn}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
