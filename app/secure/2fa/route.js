import { prisma } from "../../../lib/db";
import { secureSessions, randomCode, randomSessionId } from "../../../lib/twofa";

const page = (body) => `<!doctype html><html lang="az"><head><meta charSet="utf-8"/>
<title>2FA (təhlükəsiz)</title></head><body style="font-family:system-ui,sans-serif;max-width:760px;margin:0 auto;padding:24px 16px;line-height:1.6">
<p><a href="/">← ana səhifə</a> · <a href="/vuln/2fa">zəif versiya →</a></p>
<h1>Giriş + 2FA (təhlükəsiz)</h1>
${body}
</body></html>`;

const loginForm = `
<form method="POST">
  <input type="hidden" name="step" value="login" />
  <p><input name="username" placeholder="istifadəçi adı" /></p>
  <p><input name="password" placeholder="parol" /></p>
  <button type="submit">Giriş</button>
</form>`;

function verifyForm(code) {
  return `
<pre style="background:#1e2228;color:#e8eaed;padding:12px;border-radius:8px">Kod göndərildi (lab-da göstərilir): ${code}</pre>
<form method="POST">
  <input type="hidden" name="step" value="verify" />
  <p>Kod: <input name="code" /></p>
  <button type="submit">Təsdiq et</button>
</form>
<p style="font-size:13px;color:#666">İstifadəçi adı burada YOXDUR — server kimin login etdiyini sessiya cookie-dən bilir, forma sahəsindən yox.</p>`;
}

function getSessionId(request) {
  const cookie = request.headers.get("cookie") ?? "";
  const m = cookie.match(/tfa_session=([^;]+)/);
  return m ? m[1] : null;
}

export async function GET() {
  return new Response(page(loginForm), { headers: { "content-type": "text/html; charset=utf-8" } });
}

export async function POST(request) {
  const form = await request.formData();
  const step = form.get("step");

  if (step === "login") {
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || user.password !== password) {
      return new Response(page(`<p>İstifadəçi adı və ya parol səhvdir.</p>${loginForm}`), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    const code = randomCode();
    const sessionId = randomSessionId();
    // ✅ TƏHLÜKƏSİZ: username server-side sessiyaya bağlanır, client ona toxuna bilmir.
    secureSessions.set(sessionId, { username, code });
    return new Response(page(verifyForm(code)), {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "set-cookie": `tfa_session=${sessionId}; Path=/; HttpOnly`,
      },
    });
  }

  if (step === "verify") {
    const sessionId = getSessionId(request);
    const session = sessionId ? secureSessions.get(sessionId) : null;
    const code = String(form.get("code") ?? "");
    const ok = session && session.code === code;
    if (ok) {
      const user = await prisma.user.findUnique({ where: { username: session.username } });
      const extra = user?.role === "admin" ? "\n🔑 Admin panel: gizli sirr = \"sistemin açarı 12345\"" : "";
      secureSessions.delete(sessionId);
      return new Response(
        page(`<pre style="background:#12241e;color:#8af0b8;padding:12px;border-radius:8px">✅ Daxil oldun: ${session.username}${extra}</pre>`),
        { headers: { "content-type": "text/html; charset=utf-8" } }
      );
    }
    return new Response(page(`<p>Kod yanlışdır (və ya sessiya yoxdur — əvvəl login et).</p>${loginForm}`), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  return new Response(page(loginForm), { headers: { "content-type": "text/html; charset=utf-8" } });
}
