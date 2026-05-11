import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import styles from "./UsersPage.module.css";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Registered Users</h1>
        <p>{users?.length || 0} total users</p>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>City</th>
              <th>Province</th>
              <th>Country</th>
              <th>Admin</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.avatar}>
                      <span>{user.full_name?.charAt(0)?.toUpperCase() || "U"}</span>
                    </div>
                    <div>
                      <div className={styles.name}>{user.full_name || "Anonymous"}</div>
                      <div className={styles.subText}>{user.address || "—"}</div>
                    </div>
                  </div>
                </td>
                <td>{user.phone_1 || "—"}</td>
                <td>{user.city || "—"}</td>
                <td>{user.province || "—"}</td>
                <td>{user.country || "—"}</td>
                <td>
                  <span className={user.is_admin ? styles.badgeAdmin : styles.badgeUser}>
                    {user.is_admin ? "Admin" : "User"}
                  </span>
                </td>
                <td>{new Date(user.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
