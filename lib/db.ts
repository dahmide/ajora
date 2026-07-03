import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema"; // Your drizzle schema file

const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle({ client: sql });
export const db = drizzle(sql, { schema });
