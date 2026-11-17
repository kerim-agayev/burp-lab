import { users, matches } from "../../../lib/nosql";

export const dynamic = "force-dynamic";

// ⚠️ ZƏİF (NoSQL injection): username/password-u OLDUĞU KİMİ sorğu operatoru kimi istifadə edir.
// Client JSON-da sətir əvəzinə {"$ne": ""} kimi OBYEKT göndərsə, "bərabər deyil" yoxlamasına çevrilir.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const user = users.find((u) => matches(u.username, body.username) && matches(u.password, body.password));
  if (!user) return Response.json({ error: "İstifadəçi adı/parol yanlışdır" }, { status: 401 });
  return Response.json({ ok: true, username: user.username, role: user.role });
}
