export const dynamic = "force-dynamic";

// ⚠️ ZƏİF (SSRF): server istifadəçinin verdiyi İXTİYARİ url-ə sorğu göndərir.
// Hara getdiyinə heç bir məhdudiyyət yoxdur — xarici şəkil də, daxili/lokal ünvan da ola bilər.
export async function GET(request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) return Response.json({ error: "url parametri lazımdır" }, { status: 400 });
  try {
    const res = await fetch(url, { redirect: "manual" });
    const text = await res.text();
    return Response.json({ fetchedUrl: url, status: res.status, bodySnippet: text.slice(0, 800) });
  } catch (e) {
    return Response.json({ error: "Sorğu uğursuz oldu: " + e.message }, { status: 502 });
  }
}
