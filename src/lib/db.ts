import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { articles, images, posts, users } from "@/services/db/schemas";

const connectionString = process.env.DATABASE_URL as string;
const client = new Pool({ connectionString });

export const db = drizzle(client, {
  schema: { users, posts, articles, images },
});
