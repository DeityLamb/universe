import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { join } from 'path';

export default defineConfig({
  out: './drizzle',
  schema: join(__dirname, './src/db/schema.ts'),
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
