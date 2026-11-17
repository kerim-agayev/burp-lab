import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

// ⚠️ ZƏİF (XXE): XML body-də öz ENTITY tərifini aşağıda özümüz tapıb SYSTEM mənbəyini oxuyuruq
// (lab üçün minimal/sadələşdirilmiş parser — real tətbiqlərdə libxml/parserlər bunu default edir).
export async function POST(request) {
  const xml = await request.text();

  const entityMatch = xml.match(/<!ENTITY\s+(\w+)\s+SYSTEM\s+"([^"]+)"\s*>/);
  let resolved = xml;
  if (entityMatch) {
    const [, entName, uri] = entityMatch;
    let value = "";
    try {
      if (uri.startsWith("file://")) {
        value = fs.readFileSync(path.join(process.cwd(), uri.replace("file://", "")), "utf8");
      } else if (uri.startsWith("http://") || uri.startsWith("https://")) {
        value = await (await fetch(uri)).text();
      }
    } catch (e) {
      value = `[ENTITY oxuna bilmədi: ${e.message}]`;
    }
    resolved = resolved.replace(new RegExp(`&${entName};`, "g"), value);
  }

  const nameMatch = resolved.match(/<name>([\s\S]*?)<\/name>/);
  return Response.json({ greeting: `Salam, ${nameMatch ? nameMatch[1] : "(ad tapılmadı)"}` });
}

export async function GET() {
  return new Response(
    "POST bu ünvana Content-Type: application/xml ilə body göndər, məs. <name>Kerim</name>",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
