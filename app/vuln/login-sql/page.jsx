import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic"; // ponytail: hər dəfə canlı sorğu, cache yox

export default async function VulnLoginSql({ searchParams }) {
  const sp = await searchParams;
  const username = sp.username ?? "";
  const password = sp.password ?? "";

  // ⚠️ ZƏİF: hər iki dəyər birbaşa SQL mətninə yapışdırılır.
  // ponytail: $queryRawUnsafe BİLƏRƏKDƏN — login-bypass dərsi üçün.
  const sql = `SELECT id, username, role FROM "User" WHERE username = '${username}' AND password = '${password}'`;

  let rows = [];
  let error = null;
  let attempted = username !== "" || password !== "";

  if (attempted) {
    try {
      rows = await prisma.$queryRawUnsafe(sql);
    } catch (e) {
      error = String(e?.message ?? e);
    }
  }

  const loggedIn = rows.length > 0 ? rows[0] : null;

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/secure/login-sql">təhlükəsiz versiya →</a>
      </p>
      <h1>Giriş (zəif — SQL)</h1>
      <form>
        <p><input name="username" placeholder="istifadəçi adı" defaultValue={username} /></p>
        <p><input name="password" placeholder="parol" defaultValue={password} /></p>
        <button type="submit">Giriş</button>
      </form>

      {attempted && (
        <>
          <p style={{ fontSize: 13, color: "#666" }}>Serverdə işləyən SQL:</p>
          <pre style={{ background: "#1e2228", color: "#e8eaed", padding: 12, borderRadius: 8, overflowX: "auto" }}>
            {sql}
          </pre>

          {error ? (
            <pre style={{ background: "#2d1a12", color: "#ff9666", padding: 12, borderRadius: 8 }}>Xəta: {error}</pre>
          ) : loggedIn ? (
            <pre style={{ background: "#12241e", color: "#8af0b8", padding: 12, borderRadius: 8 }}>
              ✅ Daxil oldun: {loggedIn.username} (rol: {loggedIn.role})
              {loggedIn.role === "admin" ? "\n🔑 Admin panel: gizli sirr = \"sistemin açarı 12345\"" : ""}
            </pre>
          ) : (
            <p>Giriş uğursuz: istifadəçi adı və ya parol yanlışdır.</p>
          )}
        </>
      )}
    </main>
  );
}
