import { Sequelize } from "sequelize";

const sequelizeConnection = new Sequelize({
  dialect: "sqlite",
  storage: "./src/infrastructure-layer/db/sqlite.db",
});

export { sequelizeConnection };
