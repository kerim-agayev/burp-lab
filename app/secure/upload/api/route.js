import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";
const DIR = path.join(process.cwd(), "uploads", "secure");
// ✅ TƏHLÜKƏSİZ: uzantı allowlist + real məzmun (magic bytes) yoxlanır, ad serverdə təsadüfi yaradılır,
// cavabda tip həmişə şəkil kimi sabit verilir (+ nosniff).
const KINDS = {
  ".png": { type: "image/png", magic: [0x89, 0x50, 0x4e, 0x47] },
  ".jpg": { type: "image/jpeg", magic: [0xff, 0xd8, 0xff] },
};

export async function POST(request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return Response.json({ error: "fayl yoxdur" }, { status: 400 });

  const ext = path.extname(file.name).toLowerCase();
  const kind = KINDS[ext];
  const buf = Buffer.from(await file.arrayBuffer());
  if (!kind || !kind.magic.every((b, i) => buf[i] === b)) {
    return Response.json({ error: "icazə verilməyən fayl" }, { status: 400 });
  }
  const name = crypto.randomUUID() + ext;
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(path.join(DIR, name), buf);
  return Response.json({ ok: true, url: `/secure/upload/api?file=${name}` });
}

export async function GET(request) {
  const name = path.basename(new URL(request.url).searchParams.get("file") ?? "");
  const kind = KINDS[path.extname(name)];
  const p = path.join(DIR, name);
  if (!kind || !fs.existsSync(p)) return new Response("tapılmadı", { status: 404 });
  return new Response(fs.readFileSync(p), { headers: { "Content-Type": kind.type, "X-Content-Type-Options": "nosniff" } });
}
