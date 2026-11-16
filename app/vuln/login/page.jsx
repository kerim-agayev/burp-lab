import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic"; // ponytail: hər dəfə canlı sorğu, cache yox

export default async function VulnLogin({ searchParams }) {
  const sp = await searchParams;
  const username = sp.username ?? "";
  const password = sp.password ?? "";
  let message = null;

  if (username || password) {
    // ⚠️ ZƏİF: istifadəçi adı mövcud olub-olmamasına görə FƏRQLİ mesaj qaytarır.
    // ponytail: bilərəkdən — username enumeration dərsi üçün.
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      message = "İstifadəçi adı tapılmadı.";
    } else if (user.password !== password) {
      message = "Parol səhvdir.";
    } else {
      message = `Xoş gəldin, ${user.username}! (rol: ${user.role})`;
    }
  }

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/secure/login">təhlükəsiz versiya →</a>
      </p>
      <h1>Giriş (zəif)</h1>
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
        Diqqət: mesaj istifadəçi adının mövcud olub-olmamasına görə dəyişir.
      </p>
    </main>
  );
}
