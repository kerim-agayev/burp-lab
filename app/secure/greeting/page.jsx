export default function Page() {
  return (
    <main>
      <p><a href="/">← ana səhifə</a></p>
      <h1>Salamlama (XML, təhlükəsiz)</h1>
      <p>POST /secure/greeting ünvanına <code>Content-Type: application/xml</code> ilə body göndər, məsələn:</p>
      <pre>{'<name>Kerim</name>'}</pre>
    </main>
  );
}
