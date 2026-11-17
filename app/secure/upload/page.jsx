export default function Page() {
  return (
    <main>
      <p><a href="/">← ana səhifə</a> · <a href="/vuln/upload">zəif versiya →</a></p>
      <h1>Şəkil yüklə (təhlükəsiz)</h1>
      <form method="POST" action="/secure/upload/api" encType="multipart/form-data">
        <input type="file" name="file" />
        <button type="submit">Yüklə</button>
      </form>
    </main>
  );
}
