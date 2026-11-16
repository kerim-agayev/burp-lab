import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic"; // ponytail: hər dəfə canlı sorğu, cache yox

export default async function VulnSqli({ searchParams }) {
  const sp = await searchParams;
  const category = sp.category ?? "";

  // ⚠️ ZƏİF: istifadəçi dəyəri birbaşa SQL cümləsinə yapışdırılır (string concat).
  // ponytail: $queryRawUnsafe BİLƏRƏKDƏN — SQL injection dərsi üçün.
  const sql = `SELECT id, name, category, price FROM "Product" WHERE category = '${category}' AND released = true`;

  let rows = [];
  let error = null;
  try {
    rows = await prisma.$queryRawUnsafe(sql);
  } catch (e) {
    error = String(e?.message ?? e);
  }

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/secure/sqli?category=Gifts">təhlükəsiz versiya →</a>
      </p>
      <h1>Məhsullar — kateqoriya: {category || "(boş)"}</h1>

      <p style={{ fontSize: 13, color: "#666" }}>Serverdə işləyən SQL:</p>
      <pre style={{ background: "#1e2228", color: "#e8eaed", padding: 12, borderRadius: 8, overflowX: "auto" }}>
        {sql}
      </pre>

      {error ? (
        <pre style={{ background: "#2d1a12", color: "#ff9666", padding: 12, borderRadius: 8 }}>
          Xəta: {error}
        </pre>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr><th>id</th><th>name</th><th>category</th><th>price</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td><td>{r.name}</td><td>{r.category}</td><td>{r.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p style={{ marginTop: 12 }}>{rows.length} sətir</p>
    </main>
  );
}
