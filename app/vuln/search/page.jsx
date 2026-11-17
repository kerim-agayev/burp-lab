export const dynamic = "force-dynamic"; // ponytail: hər dəfə canlı sorğu

export default async function VulnSearch({ searchParams }) {
  const sp = await searchParams;
  const q = sp.q ?? "";

  // ⚠️ ZƏİF (Reflected XSS): istifadəçinin yazdığı mətni OLDUĞU KİMİ HTML-ə qoyuruq.
  // React normalda avtomatik escape edir (təhlükəsiz) — biz bilərəkdən dangerouslySetInnerHTML ilə
  // o qorumanı SÖNDÜRÜRÜK ki, dərs üçün zəiflik yaransın. Beləcə q içindəki <script>/<img> işləyir.
  const html = `Axtarış nəticəsi: <b>${q}</b> üçün heç nə tapılmadı.`;

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/secure/search?q=test">təhlükəsiz versiya →</a>
      </p>
      <h1>Məhsul axtarışı (zəif — Reflected XSS)</h1>
      <form>
        <p><input name="q" placeholder="nə axtarırsan?" defaultValue={q} /></p>
        <button type="submit">Axtar</button>
      </form>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
