import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * CRITICAL FIX — pg-connection-string (used internally by pg.Pool) parses
 * `sslmode=require` from the connection string URL and converts it into
 * `ssl.rejectUnauthorized = true`, which silently overrides any explicit
 * `ssl: { rejectUnauthorized: false }` option passed to Pool().
 *
 * In pg v8 / pg-connection-string v2.7+, `require`, `prefer`, and `verify-ca`
 * are all aliased to `verify-full` (full cert chain verification), which causes
 * the "self-signed certificate in certificate chain" error with Supabase.
 *
 * Fix: Strip `sslmode` (and `pgbouncer`) from the URL before Pool sees it,
 * then provide ssl config explicitly so our rejectUnauthorized=false wins.
 */
const rawUrl = process.env.DATABASE_URL!
const connectionString = rawUrl
  .replace(/([&?])sslmode=[^&]*/g, "$1")   // strip sslmode=...
  .replace(/([&?])pgbouncer=[^&]*/g, "$1") // strip pgbouncer=...
  .replace(/\?&/, "?")                      // clean up ?& → ?
  .replace(/[?&]$/, "")                     // clean up trailing ? or &

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // allow Supabase's self-signed intermediate cert
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
