// ponytail: in-memory sayğac, server restart olanda sıfırlanır — bir dev-prosesi üçün kifayətdir.
const MAX_ATTEMPTS = 3;

const byFakeIp = new Map(); // ⚠️ ZƏİF versiya: açar = client-in göndərdiyi X-Forwarded-For
const byUsername = new Map(); // ✅ TƏHLÜKƏSİZ versiya: açar = username (client dəyişə bilmir)

function check(map, key) {
  return (map.get(key) ?? 0) >= MAX_ATTEMPTS;
}
function fail(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}
function reset(map, key) {
  map.delete(key);
}

export const vulnLockout = {
  isLocked: (ip) => check(byFakeIp, ip),
  recordFailure: (ip) => fail(byFakeIp, ip),
  recordSuccess: (ip) => reset(byFakeIp, ip),
  max: MAX_ATTEMPTS,
};

export const secureLockout = {
  isLocked: (username) => check(byUsername, username),
  recordFailure: (username) => fail(byUsername, username),
  recordSuccess: (username) => reset(byUsername, username),
  max: MAX_ATTEMPTS,
};
