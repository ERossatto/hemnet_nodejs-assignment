import { Sequelize } from "sequelize";

const sequelizeConnection = new Sequelize({
  dialect: "sqlite",
  storage: "./src/infrastructure-layer/db-sqlite-sequelize/sqlite.db",
});

export { sequelizeConnection };
