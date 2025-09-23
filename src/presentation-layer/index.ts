import express from "express";
import packagesRoutes from "./routes/package.routes";
import priceRoutes from "./routes/price.routes";
import municipalityRoutes from "./routes/municipality.routes";
import { sequelizeConnection } from "../infrastructure-layer/db-sqlite-sequelize/config";
import { seedDb } from "../infrastructure-layer/db-sqlite-sequelize/seed";
import { errorHandler } from "./middleware/error.middleware";

const port = 3000;
export const app = express();

app.listen(port, () => {
  console.log(`Hemnet application running on port ${port}!`);
});
app.use(express.json());

//  Initialize database //
sequelizeConnection.sync({ force: true }).then(async () => {
  console.log("DB running");

  await seedDb();
});

// Mount routes with their prefixes
app.use("/api/municipalities", municipalityRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/packages", packagesRoutes);

// Centralized error handler (must be after routes)
app.use(errorHandler);
