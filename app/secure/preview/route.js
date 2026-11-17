export const dynamic = "force-dynamic";

// ✅ TƏHLÜKƏSİZ: yalnız icazəli (allowlist) xarici host-lara, yalnız https ilə sorğu gedir.
// localhost/127.0.0.1/daxili şəbəkə ünvanlarına heç vaxt icazə verilmir.
const ALLOWED_HOSTS = ["picsum.photos", "httpbin.org"];

export async function GET(request) {
  const raw = new URL(request.url).searchParams.get("url");
  if (!raw) return Response.json({ error: "url parametri lazımdır" }, { status: 400 });

  let parsed;
  try { parsed = new URL(raw); } catch { return Response.json({ error: "yanlış url" }, { status: 400 }); }

  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.includes(parsed.hostname)) {
    return Response.json({ error: `icazə verilməyən host: ${parsed.hostname}` }, { status: 400 });
  }

  try {
    const res = await fetch(parsed.toString(), { redirect: "manual" });
    const text = await res.text();
    return Response.json({ fetchedUrl: parsed.toString(), status: res.status, bodySnippet: text.slice(0, 800) });
  } catch (e) {
    return Response.json({ error: "Sorğu uğursuz oldu: " + e.message }, { status: 502 });
  }
}
