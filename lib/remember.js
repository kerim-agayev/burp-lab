// ponytail: in-memory state, server restart sıfırlayır — lab üçün kifayətdir.

// ✅ TƏHLÜKƏSİZ: token = uzun təsadüfi mətn, username-dən heç nə hesablanmır.
export const secureRememberTokens = new Map(); // token(string) -> username
export function issueRememberToken(username) {
  const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  secureRememberTokens.set(token, username);
  return token;
}
