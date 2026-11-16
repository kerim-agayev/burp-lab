import { cookies } from "next/headers";
import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function SecureBlind() {
  const cookieStore = await cookies();
  const trackingId = cookieStore.get("TrackingId")?.value ?? "administrator";

  // ✅ TƏHLÜKƏSİZ: cookie dəyəri mətnə yapışdırılmır, parametr kimi ötürülür.
  const user = await prisma.user.findFirst({
    where: { username: trackingId },
    select: { id: true },
  });
  const hasRow = !!user;

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/vuln/blind">zəif versiya →</a>
      </p>
      <h1>Analitika (təhlükəsiz — Blind SQLi)</h1>

      <p style={{ fontSize: 13, color: "#666" }}>
        Cari <code>TrackingId</code> cookie: <code>{trackingId}</code>
      </p>

      {hasRow ? (
        <p style={{ color: "#2e7d32", fontWeight: "bold" }}>👋 Welcome back!</p>
      ) : (
        <p style={{ color: "#999" }}>(mesaj yoxdur)</p>
      )}

      <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        Cookie dəyəri parametr kimi ötürülür, ona görə <code>' AND ...--</code> kimi girişlər sadəcə
        belə adlı istifadəçi axtarır, SQL kimi işləmir. Blind injection da işləmir.
      </p>
    </main>
  );
}
