export const dynamic = "force-dynamic";

export default async function SecureCmdi({ searchParams }) {
  const sp = await searchParams;
  const name = sp.name ?? "";

  // ✅ TƏHLÜKƏSİZ: shell-ə heç nə göndərilmir. Giriş sərt qaydaya (allowlist) uyğun olmalıdır —
  // yalnız hərf, rəqəm, boşluq. Uyğun gəlməzsə rədd edilir, əmr heç vaxt işə düşmür.
  const isSafe = /^[a-zA-Z0-9 ]*$/.test(name);
  const output = isSafe ? `Salam, ${name}` : null;

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/vuln/cmdi?name=dunya">zəif versiya →</a>
      </p>
      <h1>Salamlama servisi (təhlükəsiz)</h1>
      <form>
        <p><input name="name" placeholder="adın" defaultValue={name} /></p>
        <button type="submit">Göndər</button>
      </form>
      {isSafe ? (
        <pre style={{ background: "#12241e", color: "#8af0b8", padding: 12, borderRadius: 8 }}>{output}</pre>
      ) : (
        <p style={{ color: "#c0392b" }}>Rədd edildi: yalnız hərf, rəqəm və boşluğa icazə verilir.</p>
      )}
      <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        Heç bir shell əmri işlədilmir — salamlama sadəcə mətn birləşdirilməsidir, "&amp;", "|" kimi
        işarələr allowlist tərəfindən rədd edilir.
      </p>
    </main>
  );
}
