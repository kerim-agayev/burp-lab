import { secureResetTokens } from "../../../../lib/reset";

export const dynamic = "force-dynamic";

export default async function SecureResetConfirm({ searchParams }) {
  const sp = await searchParams;
  const token = sp.token ?? "";
  const newPassword = sp.newPassword ?? "";
  const username = token ? secureResetTokens.get(token) : null;

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/secure/reset">geri →</a>
      </p>
      <h1>Yeni parol təyin et (təhlükəsiz)</h1>
      <form>
        <input type="hidden" name="token" value={token} />
        <p><input name="newPassword" placeholder="yeni parol" /></p>
        <button type="submit">Parolu dəyiş</button>
      </form>
      {token && (
        username ? (
          newPassword ? (
            <pre style={{ background: "#12241e", color: "#8af0b8", padding: 12, borderRadius: 8 }}>
              ✅ Token qəbul edildi. Hesab: {username}. (Lab: bazaya yazılmır.)
            </pre>
          ) : (
            <p style={{ color: "#2e7d32" }}>✅ Token düzgündür — hesab: <b>{username}</b>.</p>
          )
        ) : (
          <p style={{ color: "#c0392b" }}>Token tapılmadı və ya etibarsızdır.</p>
        )
      )}
    </main>
  );
}
