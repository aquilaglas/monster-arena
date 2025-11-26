import postgres from 'postgres';

const DATABASE_URL =
  'postgresql://neondb_owner:npg_OTuzAq1veb5x@ep-weathered-breeze-ad2zbr0i-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

export const sql = postgres(DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});
