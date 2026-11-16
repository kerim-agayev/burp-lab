import { prisma } from "../../../lib/db";
import { codesByUser, randomCode } from "../../../lib/twofa";

const page = (body) => `<!doctype html><html lang="az"><head><meta charSet="utf-8"/>
<title>2FA (zəif)</title></head><body style="font-family:system-ui,sans-serif;max-width:760px;margin:0 auto;padding:24px 16px;line-height:1.6">
<p><a href="/">← ana səhifə</a> · <a href="/secure/2fa">təhlükəsiz versiya →</a></p>
<h1>Giriş + 2FA (zəif)</h1>
${body}
</body></html>`;

const loginForm = `
<form method="POST">
  <input type="hidden" name="step" value="login" />
  <p><input name="username" placeholder="istifadəçi adı" /></p>
  <p><input name="password" placeholder="parol" /></p>
  <button type="submit">Giriş</button>
</form>`;

function verifyForm(username, code) {
  return `
<pre style="background:#1e2228;color:#e8eaed;padding:12px;border-radius:8px">Kod göndərildi (lab-da göstərilir): ${code}</pre>
<form method="POST">
  <input type="hidden" name="step" value="verify" />
  <p>İstifadəçi adı (dəyişə bilərsən!): <input name="username" value="${username}" /></p>
  <p>Kod: <input name="code" /></p>
  <button type="submit">Təsdiq et</button>
</form>
<p style="font-size:13px;color:#666">Diqqət: yuxarıdakı "istifadəçi adı" sahəsi adi, dəyişdirilə bilən form sahəsidir — server kimin login etdiyini sessiyadan yox, elə bu sahədən oxuyur.</p>`;
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
    codesByUser.set(username, code);
    return new Response(page(verifyForm(username, code)), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  if (step === "verify") {
    // ⚠️ ZƏİF: username BİRBAŞA form sahəsindən götürülür — step="login"-i
    // keçib-keçmədiyinə, bu sessiyanın əsl sahibinə baxılmır.
    const username = String(form.get("username") ?? "");
    const code = String(form.get("code") ?? "");
    const expected = codesByUser.get(username);
    const ok = expected !== undefined && expected === code;
    if (ok) {
      const user = await prisma.user.findUnique({ where: { username } });
      const extra = user?.role === "admin" ? "\n🔑 Admin panel: gizli sirr = \"sistemin açarı 12345\"" : "";
      return new Response(
        page(`<pre style="background:#12241e;color:#8af0b8;padding:12px;border-radius:8px">✅ Daxil oldun: ${username}${extra}</pre>`),
        { headers: { "content-type": "text/html; charset=utf-8" } }
      );
    }
    return new Response(page(`<p>Kod yanlışdır.</p>${verifyForm(username, codesByUser.get(username) ?? "?")}`), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  return new Response(page(loginForm), { headers: { "content-type": "text/html; charset=utf-8" } });
}
