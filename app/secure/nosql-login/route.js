import { users } from "../../../lib/nosql";

export const dynamic = "force-dynamic";

// ✅ TƏHLÜKƏSİZ: username/password HƏR ZAMAN sətir (string) olmalıdır — obyekt gəlsə dərhal rədd edilir,
// heç bir "operator" semantikasına icazə verilmir.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (typeof body.username !== "string" || typeof body.password !== "string") {
    return Response.json({ error: "İstifadəçi adı/parol mətn (string) olmalıdır" }, { status: 400 });
  }
  const user = users.find((u) => u.username === body.username && u.password === body.password);
  if (!user) return Response.json({ error: "İstifadəçi adı/parol yanlışdır" }, { status: 401 });
  return Response.json({ ok: true, username: user.username, role: user.role });
}
