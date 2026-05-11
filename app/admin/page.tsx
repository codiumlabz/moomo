import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import styles from "./AdminDashboard.module.css";
import { DollarSign, Users, TrendingUp, UserPlus } from "lucide-react";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch Stats
  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { data: incomeData } = await supabase
    .from("orders")
    .select("total_amount");

  const totalIncome = incomeData?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0;

  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(5);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Overview of your store's performance</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#dcfce7", color: "#166534" }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Income</span>
            <span className={styles.statValue}>LKR {totalIncome.toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#e0f2fe", color: "#075985" }}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Registered Users</span>
            <span className={styles.statValue}>{userCount || 0}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#fef3c7", color: "#92400e" }}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Orders</span>
            <span className={styles.statValue}>{incomeData?.length || 0}</span>
          </div>
        </div>
      </div>

      <section className={styles.recentSection}>
        <h2>Recent Registered Users</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers?.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        <span>{user.full_name?.charAt(0)?.toUpperCase() || "U"}</span>
                      </div>
                      <span>{user.full_name || "Anonymous"}</span>
                    </div>
                  </td>
                  <td>{user.city ? `${user.city}, ${user.country}` : "Not provided"}</td>
                  <td>{new Date(user.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!recentUsers || recentUsers.length === 0) && (
                <tr>
                  <td colSpan={3} className={styles.empty}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
