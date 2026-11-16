import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

const DEMO_TOKEN = Buffer.from(JSON.stringify({ username: "wiener", role: "user" })).toString("base64");

export default async function SecureProfile({ searchParams }) {
  const sp = await searchParams;
  const token = sp.token ?? DEMO_TOKEN;

  let claimed = null;
  let error = null;
  try {
    claimed = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
  } catch (e) {
    error = "Token oxuna bilmədi: " + String(e?.message ?? e);
  }

  // ✅ TƏHLÜKƏSİZ: token-dəki "role" ÖTÜRÜLMÜR. Yalnız username oxunur,
  // əsl rol HƏMİŞƏ serverdə, bazadan yoxlanılır.
  let realRole = null;
  if (!error) {
    const user = await prisma.user.findUnique({ where: { username: claimed.username } });
    realRole = user?.role ?? "(naməlum istifadəçi)";
  }

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href={`/vuln/profile?token=${encodeURIComponent(token)}`}>zəif versiya →</a>
      </p>
      <h1>Profil (təhlükəsiz)</h1>
      <p style={{ fontSize: 13, color: "#666" }}>
        Token: <span style={{ wordBreak: "break-all" }}>{token}</span>
      </p>

      {error ? (
        <pre style={{ background: "#2d1a12", color: "#ff9666", padding: 12, borderRadius: 8 }}>{error}</pre>
      ) : (
        <>
          <p>İstifadəçi: <b>{claimed.username}</b> · əsl rol (bazadan): <b>{realRole}</b></p>
          <p style={{ fontSize: 13, color: "#666" }}>
            Token-in içində "role": "{claimed.role}" yazılıb, amma bura heç baxılmır — rol həmişə serverdə yoxlanılır.
          </p>
          {realRole === "admin" ? (
            <pre style={{ background: "#12241e", color: "#8af0b8", padding: 12, borderRadius: 8 }}>
              🔑 Admin panel: gizli sirr = "sistemin açarı 12345"
            </pre>
          ) : (
            <p>Adi istifadəçi görünüşü. Admin panel yoxdur.</p>
          )}
        </>
      )}
    </main>
  );
}
