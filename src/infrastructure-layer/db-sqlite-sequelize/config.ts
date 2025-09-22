import { Sequelize } from "sequelize";

// Disable logging during tests to reduce output pollution
const isTestEnvironment =
  process.env.NODE_ENV === "test" || process.env.npm_lifecycle_event === "test";

const sequelizeConnection = new Sequelize({
  dialect: "sqlite",
  storage: "./src/infrastructure-layer/db-sqlite-sequelize/sqlite.db",
  logging: isTestEnvironment ? false : console.log, // Disable logging during tests
});

export { sequelizeConnection };
