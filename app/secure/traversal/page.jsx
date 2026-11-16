import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

const imagesDir = path.join(process.cwd(), "public", "images");

export default async function SecureTraversal({ searchParams }) {
  const sp = await searchParams;
  const file = sp.file ?? "logo.png";

  // ✅ TƏHLÜKƏSİZ: yalnız fayl ADINI (path.basename) götürürük — "/" və ".." tamamilə atılır.
  // Nəticə həmişə images qovluğunun İÇİNDƏ qalır, nə yazsan da kənara çıxa bilməzsən.
  const safeName = path.basename(file);
  const fullPath = path.join(imagesDir, safeName);

  let content = null;
  let error = null;
  try {
    content = fs.readFileSync(fullPath, "utf8");
  } catch (e) {
    error = String(e?.message ?? e);
  }

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/vuln/traversal?file=logo.png">zəif versiya →</a>
      </p>
      <h1>Fayl göstər (təhlükəsiz)</h1>
      <p style={{ fontSize: 13, color: "#666" }}>
        İstəkdə <code>file</code>: <code>{file}</code> → təmizlənmiş ad: <code>{safeName}</code>
      </p>
      <pre style={{ background: "#1e2228", color: "#e8eaed", padding: 12, borderRadius: 8, overflowX: "auto" }}>
        {fullPath}
      </pre>
      {error ? (
        <pre style={{ background: "#2d1a12", color: "#ff9666", padding: 12, borderRadius: 8 }}>Xəta: {error}</pre>
      ) : (
        <pre style={{ background: "#12241e", color: "#8af0b8", padding: 12, borderRadius: 8, overflowX: "auto" }}>
          {content}
        </pre>
      )}
      <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        <code>path.basename</code> "/" və ".." işarələrini siləcək — <code>../../secret.txt</code> yazsan belə, server onu
        sadəcə <code>secret.txt</code> adlı fayl kimi oxuyacaq (images qovluğunda belə fayl yoxdur → xəta).
      </p>
    </main>
  );
}
