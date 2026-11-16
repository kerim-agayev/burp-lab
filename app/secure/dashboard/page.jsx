import { cookies } from "next/headers";
import { prisma } from "../../../lib/db";
import { secureRememberTokens } from "../../../lib/remember";

export const dynamic = "force-dynamic";

export default async function SecureDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("remember")?.value ?? null;
  const username = token ? secureRememberTokens.get(token) : null;
  const user = username ? await prisma.user.findUnique({ where: { username } }) : null;

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/secure/remember-login">giriş →</a> · <a href="/vuln/dashboard">zəif versiya →</a>
      </p>
      <h1>Dashboard (təhlükəsiz)</h1>
      <p style={{ fontSize: 13, color: "#666" }}>
        <code>remember</code> cookie: <code>{token ?? "(yoxdur)"}</code>
      </p>
      {!token ? (
        <p>Daxil olmamısan.</p>
      ) : user ? (
        <pre style={{ background: "#12241e", color: "#8af0b8", padding: 12, borderRadius: 8 }}>
          ✅ Xoş gəldin, {user.username}! (rol: {user.role})
        </pre>
      ) : (
        <p style={{ color: "#c0392b" }}>Bu cookie tanınmır.</p>
      )}
      <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        Cookie dəyəri təsadüfi token-dir, username-dən hesablanmır — kimin kim olduğunu server öz yaddaşından bilir.
      </p>
    </main>
  );
}
