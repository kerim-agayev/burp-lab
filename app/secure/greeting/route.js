export const dynamic = "force-dynamic";

// ✅ TƏHLÜKƏSİZ: DOCTYPE/ENTITY tərifi olan hər bir XML dərhal rədd edilir — entity-lər HEÇ VAXT həll olunmur.
export async function POST(request) {
  const xml = await request.text();

  if (/<!DOCTYPE/i.test(xml) || /<!ENTITY/i.test(xml)) {
    return Response.json({ error: "DOCTYPE/ENTITY olan XML qəbul edilmir" }, { status: 400 });
  }

  const nameMatch = xml.match(/<name>([\s\S]*?)<\/name>/);
  return Response.json({ greeting: `Salam, ${nameMatch ? nameMatch[1] : "(ad tapılmadı)"}` });
}
