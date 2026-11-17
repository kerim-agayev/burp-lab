export default function Page() {
  return (
    <main>
      <p><a href="/">← ana səhifə</a> · <a href="/secure/upload">təhlükəsiz versiya →</a></p>
      <h1>Şəkil yüklə (zəif)</h1>
      <form method="POST" action="/vuln/upload/api" encType="multipart/form-data">
        <input type="file" name="file" />
        <button type="submit">Yüklə</button>
      </form>
    </main>
  );
}
