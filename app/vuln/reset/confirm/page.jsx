import { vulnResetTokens } from "../../../../lib/reset";

export const dynamic = "force-dynamic";

export default async function VulnResetConfirm({ searchParams }) {
  const sp = await searchParams;
  const token = sp.token ?? "";
  const newPassword = sp.newPassword ?? "";

  // ⚠️ ZƏİF: token tapılırsa, HEÇ BİR əlavə yoxlama (kim istəyib, nə vaxt) olmadan qəbul edilir.
  const username = token ? vulnResetTokens.get(token) : null;

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/vuln/reset">geri →</a>
      </p>
      <h1>Yeni parol təyin et (zəif)</h1>
      <form>
        <input type="hidden" name="token" value={token} />
        <p><input name="newPassword" placeholder="yeni parol" /></p>
        <button type="submit">Parolu dəyiş</button>
      </form>

      {token && (
        username ? (
          newPassword ? (
            <pre style={{ background: "#12241e", color: "#8af0b8", padding: 12, borderRadius: 8 }}>
              ✅ Token qəbul edildi. Hesab: {username}. Yeni parol "{newPassword}" təyin olunardı.
              {"\n"}(Lab: bazaya yazılmır ki, digər dərslər pozulmasın — amma icazə özü verildi!)
            </pre>
          ) : (
            <p style={{ color: "#2e7d32" }}>✅ Token düzgündür — hesab: <b>{username}</b>. Aşağıda yeni parolu yaz.</p>
          )
        ) : (
          <p style={{ color: "#c0392b" }}>Token tapılmadı.</p>
        )
      )}
    </main>
  );
}
