// import { PrismaClient } from "./generated/prisma/client";

// // Use globalThis for better Edge Runtime compatibility
// declare global {
//   var __prisma: PrismaClient | undefined;
// }

// const isEdgeRuntime =
//   typeof globalThis.process === "undefined" ||
//   globalThis.process.env?.NEXT_RUNTIME === "edge";

// let prisma: PrismaClient;

// if (isEdgeRuntime) {
//   // can't use global caching in Edge Runtime,
//   throw new Error("Prisma is not supported in Edge Runtime.");
// } else {
//   // use global caching in Node.js runtime
//   if (process.env.NODE_ENV === "production") {
//     prisma = new PrismaClient({
//       log: ["error"],
//     });
//   } else {
//     if (!globalThis.__prisma) {
//       globalThis.__prisma = new PrismaClient({
//         log: ["query", "info", "warn", "error"],
//       });
//     }
//     prisma = globalThis.__prisma;
//   }
// }

// export const db = prisma;
export * from "@prisma/client";
export { db } from "./client";
