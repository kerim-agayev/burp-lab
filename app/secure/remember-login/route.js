import { prisma } from "../../../lib/db";
import { issueRememberToken } from "../../../lib/remember";

const form = `<!doctype html><html lang="az"><head><meta charSet="utf-8"/><title>Giriş</title></head>
<body style="font-family:system-ui,sans-serif;max-width:760px;margin:0 auto;padding:24px 16px;line-height:1.6">
<p><a href="/">← ana səhifə</a> · <a href="/vuln/remember-login">zəif versiya →</a></p>
<h1>Giriş — "Məni xatırla" (təhlükəsiz)</h1>
<form>
  <p><input name="username" placeholder="istifadəçi adı" /></p>
  <p><input name="password" placeholder="parol" /></p>
  <button type="submit">Giriş (həmişə "məni xatırla")</button>
</form>
</body></html>`;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const password = searchParams.get("password");

  if (username === null) {
    return new Response(form, { headers: { "content-type": "text/html; charset=utf-8" } });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.password !== password) {
    return new Response(`<p>İstifadəçi adı və ya parol səhvdir.</p>${form}`, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  // ✅ TƏHLÜKƏSİZ: cookie = uzun təsadüfi token, username-dən hesablanmır.
  const token = issueRememberToken(username);
  return new Response(null, {
    status: 302,
    headers: {
      location: "/secure/dashboard",
      "set-cookie": `remember=${token}; Path=/`,
    },
  });
}
