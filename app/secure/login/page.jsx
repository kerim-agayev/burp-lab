import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function SecureLogin({ searchParams }) {
  const sp = await searchParams;
  const username = sp.username ?? "";
  const password = sp.password ?? "";
  let message = null;

  if (username || password) {
    // ✅ TƏHLÜKƏSİZ: istifadəçi var/yox, parol səhv — HƏR HALDA eyni ümumi mesaj.
    const user = await prisma.user.findUnique({ where: { username } });
    const ok = user && user.password === password;
    message = ok ? `Xoş gəldin, ${user.username}! (rol: ${user.role})` : "İstifadəçi adı və ya parol səhvdir.";
  }

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/vuln/login">zəif versiya →</a>
      </p>
      <h1>Giriş (təhlükəsiz)</h1>
      <form>
        <p><input name="username" placeholder="istifadəçi adı" defaultValue={username} /></p>
        <p><input name="password" placeholder="parol" defaultValue={password} /></p>
        <button type="submit">Giriş</button>
      </form>
      {message && (
        <pre style={{ background: "#1e2228", color: "#e8eaed", padding: 12, borderRadius: 8 }}>
          {message}
        </pre>
      )}
      <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        İstifadəçi mövcud olsun-olmasın, cavab mesajı və ölçüsü <b>eynidir</b>. Enumeration işləmir.
      </p>
    </main>
  );
}
