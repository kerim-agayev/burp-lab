import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function SecureLoginSql({ searchParams }) {
  const sp = await searchParams;
  const username = sp.username ?? "";
  const password = sp.password ?? "";
  let attempted = username !== "" || password !== "";
  let loggedIn = null;

  if (attempted) {
    // ✅ TƏHLÜKƏSİZ: dəyərlər mətnə yapışdırılmır, parametr kimi ötürülür.
    // Prisma query builder avtomatik parametrized sorğu qurur, ona görə
    // ' OR 1=1-- kimi girişlər sadəcə sözlük olaraq axtarılır, SQL kimi işləmir.
    const user = await prisma.user.findFirst({
      where: { username, password },
      select: { id: true, username: true, role: true },
    });
    loggedIn = user ?? null;
  }

  return (
    <main>
      <p>
        <a href="/">← ana səhifə</a> · <a href="/vuln/login-sql">zəif versiya →</a>
      </p>
      <h1>Giriş (təhlükəsiz — SQL)</h1>
      <form>
        <p><input name="username" placeholder="istifadəçi adı" defaultValue={username} /></p>
        <p><input name="password" placeholder="parol" defaultValue={password} /></p>
        <button type="submit">Giriş</button>
      </form>

      {attempted && (
        loggedIn ? (
          <pre style={{ background: "#12241e", color: "#8af0b8", padding: 12, borderRadius: 8 }}>
            ✅ Daxil oldun: {loggedIn.username} (rol: {loggedIn.role})
          </pre>
        ) : (
          <>
            <p>Giriş uğursuz: istifadəçi adı və ya parol yanlışdır.</p>
            <p style={{ fontSize: 13, color: "#666" }}>
              Burada dəyərlər SQL mətninə yapışdırılmır. <code>' OR 1=1--</code> yazsanız,
              sadəcə belə adlı istifadəçi axtarılır və tapılmır. Injection işləmir.
            </p>
          </>
        )
      )}
    </main>
  );
}
