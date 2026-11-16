import { cookies } from "next/headers";
import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic"; // ponytail: hər dəfə canlı sorğu, cache yox

export default async function VulnBlind() {
  const cookieStore = await cookies();
  // Tracking cookie — yoxdursa default 'administrator'. Dəyəri Burp Repeater-də dəyişəcəyik.
  const trackingId = cookieStore.get("TrackingId")?.value ?? "administrator";

  // ⚠️ ZƏİF: cookie dəyəri birbaşa SQL mətninə yapışdırılır.
  // ponytail: $queryRawUnsafe BİLƏRƏKDƏN — blind SQLi dərsi üçün.
  // Nəticə EKRANDA GÖSTƏRİLMİR — yalnız sətir gəlib-gəlmədiyi "Welcome back" ilə bilinir.
  const sql = `SELECT id FROM "User" WHERE username = '${trackingId}'`;

  let hasRow = false;
  let error = null;
  try {
    const rows = await prisma.$queryRawUnsafe(sql);
    hasRow = rows.length > 0;
  } catch (e) {
    error = String(e?.message ?? e);
  }

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/secure/blind">təhlükəsiz versiya →</a>
      </p>
      <h1>Analitika (zəif — Blind SQLi)</h1>

      <p style={{ fontSize: 13, color: "#666" }}>
        Cari <code>TrackingId</code> cookie: <code>{trackingId}</code>
      </p>
      <p style={{ fontSize: 13, color: "#666" }}>Serverdə işləyən SQL (real blind-də bunu GÖRMƏZDİN):</p>
      <pre style={{ background: "#1e2228", color: "#e8eaed", padding: 12, borderRadius: 8, overflowX: "auto" }}>
        {sql}
      </pre>

      {error ? (
        <pre style={{ background: "#2d1a12", color: "#ff9666", padding: 12, borderRadius: 8 }}>Xəta: {error}</pre>
      ) : hasRow ? (
        <p style={{ color: "#2e7d32", fontWeight: "bold" }}>👋 Welcome back!</p>
      ) : (
        <p style={{ color: "#999" }}>(mesaj yoxdur)</p>
      )}

      <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        Diqqət: məlumat (parol, ad) ekranda heç vaxt görünmür. Yalnız <b>"Welcome back"</b> var/yox —
        bu, bir bitlik "hə/yox" cavabıdır. Məlumatı bu cavablarla, hərf-hərf çıxaracağıq.
      </p>
    </main>
  );
}
