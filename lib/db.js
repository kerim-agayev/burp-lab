import { PrismaClient } from "@prisma/client";

// ponytail: tək PrismaClient (Next dev hot-reload çox client yaratmasın)
const g = globalThis;
export const prisma = g.__prisma ?? new PrismaClient();
if (!g.__prisma) g.__prisma = prisma;
