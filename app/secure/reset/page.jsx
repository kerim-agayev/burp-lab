import { issueSecureToken } from "../../../lib/reset";

export const dynamic = "force-dynamic";

export default async function SecureReset({ searchParams }) {
  const sp = await searchParams;
  const username = sp.username ?? "";
  let token = null;
  if (username) token = issueSecureToken(username);

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/vuln/reset">zəif versiya →</a>
      </p>
      <h1>Parolu unutdum (təhlükəsiz)</h1>
      <form>
        <p><input name="username" placeholder="istifadəçi adı" defaultValue={username} /></p>
        <button type="submit">Bərpa linki göndər</button>
      </form>
      {token && (
        <>
          <p style={{ fontSize: 13, color: "#666" }}>
            "E-poçtunuza" göndərildi (lab-da birbaşa göstərilir):
          </p>
          <pre style={{ background: "#1e2228", color: "#e8eaed", padding: 12, borderRadius: 8, overflowX: "auto" }}>
            {`/secure/reset/confirm?token=${token}`}
          </pre>
          <p style={{ fontSize: 13, color: "#666" }}>Token uzun və təsadüfidir — təxmin edilə bilməz.</p>
        </>
      )}
    </main>
  );
}
