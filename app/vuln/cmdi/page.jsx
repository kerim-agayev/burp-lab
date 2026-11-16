import { exec } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(exec);
export const dynamic = "force-dynamic"; // ponytail: hər dəfə canlı sorğu, cache yox

export default async function VulnCmdi({ searchParams }) {
  const sp = await searchParams;
  const name = sp.name ?? "";

  // ⚠️ ZƏİF: istifadəçi dəyəri birbaşa shell əmrinə yapışdırılır.
  // ponytail: bilərəkdən — command injection dərsi üçün. Yalnız zərərsiz əmrlərlə (whoami, dir) sına!
  const cmd = `echo Salam, ${name}`;

  let output = null;
  let error = null;
  try {
    const { stdout } = await run(cmd);
    output = stdout;
  } catch (e) {
    error = String(e?.message ?? e);
  }

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/secure/cmdi?name=dunya">təhlükəsiz versiya →</a>
      </p>
      <h1>Salamlama servisi (zəif — Command injection)</h1>
      <form>
        <p><input name="name" placeholder="adın" defaultValue={name} /></p>
        <button type="submit">Göndər</button>
      </form>
      <p style={{ fontSize: 13, color: "#666" }}>Serverdə işləyən əmr (real həyatda bunu GÖRMƏZDİN):</p>
      <pre style={{ background: "#1e2228", color: "#e8eaed", padding: 12, borderRadius: 8, overflowX: "auto" }}>
        {cmd}
      </pre>
      {error ? (
        <pre style={{ background: "#2d1a12", color: "#ff9666", padding: 12, borderRadius: 8, overflowX: "auto" }}>Xəta: {error}</pre>
      ) : (
        <pre style={{ background: "#12241e", color: "#8af0b8", padding: 12, borderRadius: 8, overflowX: "auto", whiteSpace: "pre-wrap" }}>
          {output}
        </pre>
      )}
      <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        Windows cmd-də əmrləri <code>&amp;</code> (ardıcıl) və ya <code>|</code> (nəticəni ötür) ilə birləşdirmək olar.
      </p>
    </main>
  );
}
