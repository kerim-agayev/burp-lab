// ponytail: real Mongo yoxdur, sadə in-memory "sənəd" kolleksiyası — konsepti öyrətmək üçün kifayətdir.
export const users = [
  { username: "administrator", password: "s3cr3t-Pa55", role: "admin" },
  { username: "wiener", password: "peter", role: "user" },
  { username: "carlos", password: "montoya", role: "user" },
];

// Mongo-vari operator yoxlaması: dəyər { "$ne": "..." } kimi OBYEKT olsa, bərabərlik yoxlamır,
// "bərabər DEYİL" şərtini yoxlayır — demək, demək olar hər şeylə uyğun gəlir.
export function matches(fieldValue, query) {
  if (query !== null && typeof query === "object") {
    if ("$ne" in query) return fieldValue !== query.$ne;
    if ("$gt" in query) return fieldValue > query.$gt;
    if ("$regex" in query) return new RegExp(query.$regex).test(fieldValue);
    return false;
  }
  return fieldValue === query;
}
