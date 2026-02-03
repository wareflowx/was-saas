import type { Config } from 'drizzle-kit'

export default {
  schema: './src/backend/database/drizzle-schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './wareflow.db',
  },
} satisfies Config
