import { issueVulnToken } from "../../../lib/reset";

export const dynamic = "force-dynamic"; // ponytail: hər dəfə canlı sorğu, cache yox

export default async function VulnReset({ searchParams }) {
  const sp = await searchParams;
  const username = sp.username ?? "";
  let token = null;
  if (username) token = issueVulnToken(username);

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/secure/reset">təhlükəsiz versiya →</a>
      </p>
      <h1>Parolu unutdum (zəif)</h1>
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
            {`/vuln/reset/confirm?token=${token}`}
          </pre>
          <p style={{ fontSize: 13, color: "#666" }}>
            Diqqət: token sadəcə ardıcıl bir rəqəmdir (bax Dərs 15 — Sequencer).
          </p>
        </>
      )}
    </main>
  );
}
