import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { env } from "node:process";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: env.NODE_ENV === "development",
  log: env.NODE_ENV === "development" ? null : () => {},
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
    });

    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
