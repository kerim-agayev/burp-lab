export default function Home() {
  return (
    <main>
      <h1>⚠️ Burp Lab</h1>
      <p>
        Bu sayt <b>qəsdən zəifdir</b>. Yalnız öz öyrənməmiz üçündür. Hər mövzunun
        iki versiyası var: <code>/vuln</code> (zəif) və <code>/secure</code> (düzəldilmiş).
      </p>

      <h2>Dərslər</h2>
      <ul>
        <li>
          <b>SQL injection</b> — məhsul filtri:{" "}
          <a href="/vuln/sqli?category=Gifts">/vuln/sqli?category=Gifts</a> ·{" "}
          <a href="/secure/sqli?category=Gifts">/secure/sqli</a>
        </li>
        <li>
          <b>Username enumeration (login)</b> —{" "}
          <a href="/vuln/login">/vuln/login</a> · <a href="/secure/login">/secure/login</a>
        </li>
        <li>
          <b>Insecure token (Base64 rol)</b> —{" "}
          <a href="/vuln/profile">/vuln/profile</a> · <a href="/secure/profile">/secure/profile</a>
        </li>
        <li>
          <b>SQL login bypass</b> —{" "}
          <a href="/vuln/login-sql">/vuln/login-sql</a> · <a href="/secure/login-sql">/secure/login-sql</a>
        </li>
      </ul>

      <p style={{ color: "#888", fontSize: 14 }}>
        Növbəti dərslərdə bura yeni zəifliklər əlavə olunacaq.
      </p>
    </main>
  );
}
