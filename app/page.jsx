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
        <li>
          <b>Blind SQLi (cookie)</b> —{" "}
          <a href="/vuln/blind">/vuln/blind</a> · <a href="/secure/blind">/secure/blind</a>
        </li>
        <li>
          <b>Brute-force lockout bypass (header)</b> —{" "}
          <a href="/vuln/bruteforce">/vuln/bruteforce</a> · <a href="/secure/bruteforce">/secure/bruteforce</a>
        </li>
        <li>
          <b>2FA broken logic (POST)</b> —{" "}
          <a href="/vuln/2fa">/vuln/2fa</a> · <a href="/secure/2fa">/secure/2fa</a>
        </li>
        <li>
          <b>Password reset token predictability</b> —{" "}
          <a href="/vuln/reset">/vuln/reset</a> · <a href="/secure/reset">/secure/reset</a>
        </li>
        <li>
          <b>"Remember me" cookie forgery</b> —{" "}
          <a href="/vuln/dashboard">/vuln/dashboard</a> · <a href="/secure/dashboard">/secure/dashboard</a>
        </li>
        <li>
          <b>Path traversal (file read)</b> —{" "}
          <a href="/vuln/traversal?file=logo.png">/vuln/traversal</a> · <a href="/secure/traversal?file=logo.png">/secure/traversal</a>
        </li>
        <li>
          <b>Command injection</b> —{" "}
          <a href="/vuln/cmdi?name=dunya">/vuln/cmdi</a> · <a href="/secure/cmdi?name=dunya">/secure/cmdi</a>
        </li>
        <li>
          <b>Business logic: price manipulation</b> —{" "}
          <a href="/vuln/checkout?productId=1">/vuln/checkout</a> · <a href="/secure/checkout?productId=1">/secure/checkout</a>
        </li>
        <li>
          <b>Information disclosure: verbose error (API)</b> —{" "}
          <a href="/vuln/account?id=abc">/vuln/account</a> · <a href="/secure/account?id=abc">/secure/account</a>
        </li>
        <li>
          <b>Access control: IDOR (cookie + id)</b> —{" "}
          <a href="/vuln/user">/vuln/user</a> · <a href="/secure/user">/secure/user</a>
        </li>
        <li>
          <b>File upload (multipart)</b> —{" "}
          <a href="/vuln/upload">/vuln/upload</a> · <a href="/secure/upload">/secure/upload</a>
        </li>
      </ul>

      <p style={{ color: "#888", fontSize: 14 }}>
        Növbəti dərslərdə bura yeni zəifliklər əlavə olunacaq.
      </p>
    </main>
  );
}
