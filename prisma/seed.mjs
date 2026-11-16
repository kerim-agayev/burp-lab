import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ponytail: hamısı SAXTA data. Real ad/parol/email YOX.
const products = [
  { name: "Çay dəsti", category: "Gifts", price: 25, released: true },
  { name: "Kubik Rubik", category: "Toys", price: 8, released: true },
  { name: "Termos", category: "Gifts", price: 15, released: true },
  { name: "Lego qala", category: "Toys", price: 60, released: true },
  { name: "Gizli yeni məhsul", category: "Gifts", price: 99, released: false },
  { name: "Futbolka", category: "Clothes", price: 12, released: true },
];

const users = [
  { username: "administrator", password: "s3cr3t-Pa55", role: "admin" },
  { username: "wiener", password: "peter", role: "user" },
  { username: "carlos", password: "montoya", role: "user" },
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.createMany({ data: products });
  await prisma.user.createMany({ data: users });
  console.log(`Seed OK: ${products.length} product, ${users.length} user.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
