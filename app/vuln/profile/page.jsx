export const dynamic = "force-dynamic"; // ponytail: hər dəfə canlı sorğu, cache yox

const DEMO_TOKEN = Buffer.from(JSON.stringify({ username: "wiener", role: "user" })).toString("base64");

export default async function VulnProfile({ searchParams }) {
  const sp = await searchParams;
  const token = sp.token ?? DEMO_TOKEN;

  let data = null;
  let error = null;
  try {
    // ⚠️ ZƏİF: token-in içindəki "role" dəyərinə birbaşa güvənilir.
    // ponytail: imza/yoxlama YOX — bilərəkdən, Decoder dərsi üçün.
    data = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
  } catch (e) {
    error = "Token oxuna bilmədi: " + String(e?.message ?? e);
  }

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href={`/secure/profile?token=${encodeURIComponent(token)}`}>təhlükəsiz versiya →</a>
      </p>
      <h1>Profil (zəif)</h1>
      <p style={{ fontSize: 13, color: "#666" }}>
        Sənin token-in (Base64, imzasız) — Decoder-ə kopyala, aç, dəyiş:
      </p>
      <pre style={{ background: "#1e2228", color: "#e8eaed", padding: 12, borderRadius: 8, overflowX: "auto", wordBreak: "break-all" }}>
        {token}
      </pre>

      {error ? (
        <pre style={{ background: "#2d1a12", color: "#ff9666", padding: 12, borderRadius: 8 }}>{error}</pre>
      ) : (
        <>
          <p>İstifadəçi: <b>{data.username}</b> · rol (token-dən, yoxlanılmadan): <b>{data.role}</b></p>
          {data.role === "admin" ? (
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
