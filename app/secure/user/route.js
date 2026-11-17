import { cookies } from "next/headers";
import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

// ✅ TƏHLÜKƏSİZ: istənilən id-nin girişli istifadəçiyə aid olub-olmadığı yoxlanılır.
export async function GET(request) {
  const raw = (await cookies()).get("remember")?.value;
  if (!raw) return Response.json({ error: "Giriş et: /vuln/remember-login" }, { status: 401 });
  const me = await prisma.user.findUnique({ where: { username: Buffer.from(raw, "base64").toString("utf8") } });
  if (!me) return Response.json({ error: "Tanınmayan cookie" }, { status: 401 });

  const id = Number(new URL(request.url).searchParams.get("id") ?? me.id);
  if (id !== me.id && me.role !== "admin") return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return Response.json({ error: "Tapılmadı" }, { status: 404 });
  return Response.json({ you: me.username, id: target.id, username: target.username, role: target.role, balance: 1000 + target.id * 7 });
}
