import { PrismaClient } from "@prisma/client";
// Cache the client in dev to avoid exhausting connections during hot reloads.
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
