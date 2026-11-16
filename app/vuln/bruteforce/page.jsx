import { headers } from "next/headers";
import { prisma } from "../../../lib/db";
import { vulnLockout } from "../../../lib/lockout";

export const dynamic = "force-dynamic"; // ponytail: hər dəfə canlı sorğu, cache yox

export default async function VulnBruteforce({ searchParams }) {
  const sp = await searchParams;
  const username = sp.username ?? "";
  const password = sp.password ?? "";
  const attempted = username !== "" || password !== "";

  const h = await headers();
  // ⚠️ ZƏİF: "client IP" kimi X-Forwarded-For başlığına güvənilir — bunu HƏR KƏS yaza bilər.
  const clientIp = h.get("x-forwarded-for") ?? "127.0.0.1";

  let message = null;
  let locked = false;

  if (attempted) {
    locked = vulnLockout.isLocked(clientIp);
    if (locked) {
      message = `🔒 Çox cəhd (${vulnLockout.max}+) bu ünvandan (${clientIp}). Sonra yenidən cəhd et.`;
    } else {
      const user = await prisma.user.findUnique({ where: { username } });
      const ok = user && user.password === password;
      if (ok) {
        vulnLockout.recordSuccess(clientIp);
        message = `✅ Daxil oldun: ${user.username} (rol: ${user.role})`;
      } else {
        vulnLockout.recordFailure(clientIp);
        message = "İstifadəçi adı və ya parol səhvdir.";
      }
    }
  }

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/secure/bruteforce">təhlükəsiz versiya →</a>
      </p>
      <h1>Giriş + lockout (zəif)</h1>
      <p style={{ fontSize: 13, color: "#666" }}>
        Aşkarlanan "IP" (<code>X-Forwarded-For</code> başlığından): <code>{clientIp}</code>
      </p>
      <form>
        <p><input name="username" placeholder="istifadəçi adı" defaultValue={username} /></p>
        <p><input name="password" placeholder="parol" defaultValue={password} /></p>
        <button type="submit">Giriş</button>
      </form>
      {message && (
        <pre style={{ background: locked ? "#2d1a12" : "#1e2228", color: locked ? "#ff9666" : "#e8eaed", padding: 12, borderRadius: 8 }}>
          {message}
        </pre>
      )}
      <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        {vulnLockout.max} səhv cəhddən sonra bu "IP" kilidlənir. Repeater-də <code>X-Forwarded-For</code>-u
        hər cəhddə dəyişsən, kilid heç vaxt birikmir.
      </p>
    </main>
  );
}
