export const dynamic = "force-dynamic"; // ponytail: hər dəfə canlı sorğu

export default async function SecureSearch({ searchParams }) {
  const sp = await searchParams;
  const q = sp.q ?? "";

  // ✅ TƏHLÜKƏSİZ: istifadəçi mətnini adi {q} kimi veririk. React bunu AVTOMATİK escape edir —
  // yəni < > & " simvolları zərərsiz mətnə çevrilir (&lt; &gt; ...), heç bir HTML/script işləmir.
  // Fərq: burada dangerouslySetInnerHTML YOXDUR.
  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/vuln/search?q=test">zəif versiya →</a>
      </p>
      <h1>Məhsul axtarışı (təhlükəsiz)</h1>
      <form>
        <p><input name="q" placeholder="nə axtarırsan?" defaultValue={q} /></p>
        <button type="submit">Axtar</button>
      </form>
      <hr />
      <p>Axtarış nəticəsi: <b>{q}</b> üçün heç nə tapılmadı.</p>
    </main>
  );
}
