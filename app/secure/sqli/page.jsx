import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function SecureSqli({ searchParams }) {
  const sp = await searchParams;
  const category = sp.category ?? "";

  // ✅ TƏHLÜKƏSİZ: dəyər cümləyə yapışdırılmır, ayrıca parametr kimi ötürülür.
  // Prisma query builder avtomatik parametrized (parameterized) sorğu qurur.
  const rows = await prisma.product.findMany({
    where: { category, released: true },
    select: { id: true, name: true, category: true, price: true },
    orderBy: { id: "asc" },
  });

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/vuln/sqli?category=Gifts">zəif versiya →</a>
      </p>
      <h1>Məhsullar (təhlükəsiz) — kateqoriya: {category || "(boş)"}</h1>
      <p style={{ fontSize: 13, color: "#666" }}>
        Burada <code>category</code> dəyəri SQL mətninə yapışdırılmır. <code>Gifts'--</code> yazsanız,
        sadəcə belə adlı kateqoriya axtarılır və heç nə tapılmır. Injection işləmir.
      </p>
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
      <p style={{ marginTop: 12 }}>{rows.length} sətir</p>
    </main>
  );
}
