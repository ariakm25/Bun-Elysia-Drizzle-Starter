import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { join } from 'path';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const postgresClient = postgres(dbUrl);

export const database: PostgresJsDatabase = drizzle(postgresClient);

async function main() {
  console.log('Migrating...');
  const migrationFolder = join(__dirname, 'migrations');
  await migrate(database, {
    migrationsFolder: migrationFolder,
  });
}

main()
  .then(() => {
    console.log('Migration done.');
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(0);
  });
