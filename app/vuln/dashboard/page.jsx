import { cookies } from "next/headers";
import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function VulnDashboard() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("remember")?.value ?? null;

  let username = null;
  let error = null;
  if (raw) {
    try {
      username = Buffer.from(raw, "base64").toString("utf8");
    } catch (e) {
      error = "Cookie oxuna bilmədi.";
    }
  }

  const user = username ? await prisma.user.findUnique({ where: { username } }) : null;

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/vuln/remember-login">giriş →</a> · <a href="/secure/dashboard">təhlükəsiz versiya →</a>
      </p>
      <h1>Dashboard (zəif)</h1>
      <p style={{ fontSize: 13, color: "#666" }}>
        <code>remember</code> cookie: <code>{raw ?? "(yoxdur)"}</code>
      </p>
      {!raw ? (
        <p>Daxil olmamısan.</p>
      ) : error ? (
        <p style={{ color: "#c0392b" }}>{error}</p>
      ) : user ? (
        <pre style={{ background: "#12241e", color: "#8af0b8", padding: 12, borderRadius: 8 }}>
          ✅ Xoş gəldin, {user.username}! (rol: {user.role})
          {user.role === "admin" ? "\n🔑 Admin panel: gizli sirr = \"sistemin açarı 12345\"" : ""}
        </pre>
      ) : (
        <p style={{ color: "#c0392b" }}>Belə istifadəçi yoxdur.</p>
      )}
      <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        Cookie dəyəri sadəcə <code>Base64(username)</code> — imzasız. Decoder-də özün üçün hazırlaya bilərsən.
      </p>
    </main>
  );
}
