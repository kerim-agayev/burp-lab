import { prisma } from "../../../lib/db";
import { secureLockout } from "../../../lib/lockout";

export const dynamic = "force-dynamic";

export default async function SecureBruteforce({ searchParams }) {
  const sp = await searchParams;
  const username = sp.username ?? "";
  const password = sp.password ?? "";
  const attempted = username !== "" || password !== "";

  let message = null;
  let locked = false;

  if (attempted) {
    // ✅ TƏHLÜKƏSİZ: lockout AÇARI username-dir, client-in göndərə biləcəyi
    // heç bir başlıq (X-Forwarded-For və s.) nəzərə alınmır.
    locked = secureLockout.isLocked(username);
    if (locked) {
      message = `🔒 Çox cəhd (${secureLockout.max}+) bu hesab üçün. Sonra yenidən cəhd et.`;
    } else {
      const user = await prisma.user.findUnique({ where: { username } });
      const ok = user && user.password === password;
      if (ok) {
        secureLockout.recordSuccess(username);
        message = `✅ Daxil oldun: ${user.username} (rol: ${user.role})`;
      } else {
        secureLockout.recordFailure(username);
        message = "İstifadəçi adı və ya parol səhvdir.";
      }
    }
  }

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/vuln/bruteforce">zəif versiya →</a>
      </p>
      <h1>Giriş + lockout (təhlükəsiz)</h1>
      <form>
        <p><input name="username" placeholder="istifadəçi adı" defaultValue={username} /></p>
        <p><input name="password" placeholder="parol" defaultValue={password} /></p>
        <button type="submit">Giriş</button>
      </form>
      {message && (
        <pre style={{ background: locked ? "#2d1a12" : "#12241e", color: locked ? "#ff9666" : "#8af0b8", padding: 12, borderRadius: 8 }}>
          {message}
        </pre>
      )}
      <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        Kilid hesabın özünə bağlıdır (username), header-lə sıfırlanmır — <code>X-Forwarded-For</code>-u
        dəyişmək heç nəyə təsir etmir.
      </p>
    </main>
  );
}
