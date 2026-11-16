// ponytail: in-memory state, server restart sıfırlayır — lab üçün kifayətdir.
// 2 rəqəmli kod (00-99) qəsdən: əllə/kiçik Intruder siyahısı ilə məşq üçün.
// Real dünyada 4-6 rəqəm olur, həmişə Intruder/avtomatlaşdırma lazımdır.

export const codesByUser = new Map(); // ⚠️ ZƏİF: username → kod, sessiyaya bağlı deyil
// Lab asanlığı üçün administrator-un kodu əvvəlcədən "aktivdir" (elə bil başqa yerdən artıq login edib,
// 2FA gözləyir) — beləcə parolunu bilmədən birbaşa verify-i hədəfləmək olur.
codesByUser.set("administrator", "42");

export const secureSessions = new Map(); // ✅ TƏHLÜKƏSİZ: sessionId → {username, code}

export function randomCode() {
  return String(Math.floor(Math.random() * 100)).padStart(2, "0");
}

export function randomSessionId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
