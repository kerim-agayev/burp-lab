// ponytail: in-memory state, server restart sıfırlayır — lab üçün kifayətdir.

// ⚠️ ZƏİF: token = ardıcıl say (1000, 1001, 1002...) — Sequencer dərsindəki
// "0 bit entropiya" nümunəsinin eynisi, amma real axında.
let vulnCounter = 1000;
export const vulnResetTokens = new Map(); // token(string) -> username

// Lab realistik olsun deyə: elə bil administrator bir az əvvəl öz parolunu unudub,
// artıq bir token alıb (siz sayğacı görəndə bunun "yaxınlıqda" olduğunu başa düşəcəksiniz).
vulnResetTokens.set(String(vulnCounter++), "administrator");

export function issueVulnToken(username) {
  const token = String(vulnCounter++);
  vulnResetTokens.set(token, username);
  return token;
}

// ✅ TƏHLÜKƏSİZ: token = uzun təsadüfi mətn.
export const secureResetTokens = new Map(); // token(string) -> username
export function issueSecureToken(username) {
  const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  secureResetTokens.set(token, username);
  return token;
}
