import { PrismaClient } from "@prisma/client";

// Standard Next.js dev-mode singleton pattern to avoid exhausting the
// database connection pool on hot reload.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
