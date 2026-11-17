import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";
const DIR = path.join(process.cwd(), "uploads", "vuln");
const TYPES = { ".html": "text/html", ".png": "image/png", ".jpg": "image/jpeg", ".txt": "text/plain" };

// ⚠️ ZƏİF: yalnız client-in göndərdiyi Content-Type başlığına baxır ("image/..." olsun).
// Fayl adı/uzantısı və real məzmun yoxlanmır, ad olduğu kimi saxlanır.
export async function POST(request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return Response.json({ error: "fayl yoxdur" }, { status: 400 });
  if (!file.type.startsWith("image/")) return Response.json({ error: "yalnız şəkil olar" }, { status: 400 });

  const name = path.basename(file.name); // ponytail: basename yalnız lab-ın disk xaricinə yazmasın deyə
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(path.join(DIR, name), Buffer.from(await file.arrayBuffer()));
  return Response.json({ ok: true, url: `/vuln/upload/api?file=${encodeURIComponent(name)}` });
}

export async function GET(request) {
  const name = path.basename(new URL(request.url).searchParams.get("file") ?? "");
  const p = path.join(DIR, name);
  if (!name || !fs.existsSync(p)) return new Response("tapılmadı", { status: 404 });
  const type = TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream";
  return new Response(fs.readFileSync(p), { headers: { "Content-Type": type } });
}
