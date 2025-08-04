import { db } from "./index";
// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres"; // Importação corrigida
import { Pool } from "pg";
import * as schema from "./schema"; // Importa todas as suas definições de esquema

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
