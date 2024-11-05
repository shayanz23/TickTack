import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { type DB } from "./types.js"
import pg from "pg"
import "dotenv/config"

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new pg.Pool ({
      connectionString: process.env.DATABASE_URL as string,
    }),
  }),
  plugins: [new CamelCasePlugin],
});