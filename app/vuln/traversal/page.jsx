import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic"; // ponytail: hər dəfə canlı sorğu, cache yox

const imagesDir = path.join(process.cwd(), "public", "images");

export default async function VulnTraversal({ searchParams }) {
  const sp = await searchParams;
  const file = sp.file ?? "logo.png";

  // ⚠️ ZƏİF: istifadəçi dəyəri birbaşa qovluq yoluna yapışdırılır, "../" təmizlənmir.
  // ponytail: bilərəkdən — path traversal dərsi üçün.
  const fullPath = path.join(imagesDir, file);

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
        <a href="/">← ana səhifə</a> · <a href="/secure/traversal?file=logo.png">təhlükəsiz versiya →</a>
      </p>
      <h1>Fayl göstər (zəif)</h1>
      <p style={{ fontSize: 13, color: "#666" }}>
        İstəkdə <code>file</code>: <code>{file}</code>
      </p>
      <p style={{ fontSize: 13, color: "#666" }}>Serverin oxuduğu tam yol (real traversal-da bunu GÖRMƏZDİN):</p>
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
        Normalda bura <code>public/images/</code> qovluğundakı şəkillər üçündür (məs. <code>?file=logo.png</code>).
      </p>
    </main>
  );
}
