import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { userSeeder } from './seeders/user.seeder';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const postgresClient = postgres(dbUrl);

export const database: PostgresJsDatabase = drizzle(postgresClient);

async function main() {
  console.log('Seeding...');

  await userSeeder(database);
}

main()
  .then(() => {
    console.log('Seed done.');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
