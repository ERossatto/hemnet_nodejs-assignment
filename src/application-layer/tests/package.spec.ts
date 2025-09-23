import { sequelizeConnection } from "../../infrastructure-layer/db-sqlite-sequelize/config";
import { seedDb } from "../../infrastructure-layer/db-sqlite-sequelize/seed";
import { PackageSequelizeRepository } from "../../infrastructure-layer/db-sqlite-sequelize/repositories/package.sequelize-repository";
import { PriceSequelizeRepository } from "../../infrastructure-layer/db-sqlite-sequelize/repositories/price.sequelize-repository";
import { MunicipalitySequelizeRepository } from "../../infrastructure-layer/db-sqlite-sequelize/repositories/municipality.sequelize-repository";
import {
  PriceDomainService,
  MunicipalityDomainService,
} from "../../domain-layer";
import { PACKAGE_TYPES } from "../../domain-layer/value-objects/package-type.value-object";

import { AddPackagePriceUseCase } from "../use-cases/package/add-package-price.use-case";
import { GetCurrentPriceUseCase } from "../use-cases/price/get-current-price.use-case";
import { GetAllPricesForPackageTypeUseCase } from "../use-cases/price/get-all-prices-for-package-type.use-case";
import { GetMunicipalityByNameUseCase } from "../use-cases/municipality/get-municipality-by-name.use-case";

describe("Package Use-Cases", () => {
  // Set the db object to a variable which can be accessed throughout the whole test file
  const db = sequelizeConnection;

  let addPackagePrice: AddPackagePriceUseCase;
  let getCurrentPrice: GetCurrentPriceUseCase;
  let getAllPricesForPackageType: GetAllPricesForPackageTypeUseCase;
  let getMunicipalityByName: GetMunicipalityByNameUseCase;

  // Before any tests run, clear the DB and run migrations with Sequelize sync()
  beforeEach(async () => {
    await db.sync({ force: true });
    await seedDb();

    // Setup repositories
    const packageRepository = new PackageSequelizeRepository();
    const priceRepository = new PriceSequelizeRepository();
    const municipalityRepository = new MunicipalitySequelizeRepository();

    // Setup domain services
    const priceDomainService = new PriceDomainService(
      priceRepository,
      packageRepository,
      municipalityRepository
    );
    const municipalityDomainService = new MunicipalityDomainService(
      municipalityRepository
    );

    // Setup application use-cases
    addPackagePrice = new AddPackagePriceUseCase(
      packageRepository,
      priceDomainService,
      municipalityRepository
    );

    getCurrentPrice = new GetCurrentPriceUseCase(priceDomainService);

    getAllPricesForPackageType = new GetAllPricesForPackageTypeUseCase(
      priceRepository
    );

    getMunicipalityByName = new GetMunicipalityByNameUseCase(
      municipalityDomainService
    );
  });

  afterAll(async () => {
    await db.close();
  });

  it("Updates the current price of the provided package", async () => {
    // Step 1: Use Basic package type (already created by seed)
    // Step 2: Add initial price of 0 (use a future date to override seeded data)
    await addPackagePrice.execute({
      packageType: PACKAGE_TYPES.Basic,
      valueCents: 0,
      currency: "SEK",
      effectiveDate: new Date("2025-01-01"),
    });

    // Step 3: Add updated price of 200_00 (even more recent date)
    const newPrice = await addPackagePrice.execute({
      packageType: PACKAGE_TYPES.Basic,
      valueCents: 200_00,
      currency: "SEK",
      effectiveDate: new Date("2025-06-01"),
    });

    // Step 4: Verify the new price is 200_00
    expect(newPrice.valueCents.value).toBe(200_00);

    // Step 5: Verify that getting current price returns the latest price
    const currentPrice = await getCurrentPrice.execute({
      packageType: PACKAGE_TYPES.Basic,
    });

    // Step 6: Verify that the current price is 200_00
    expect(currentPrice).not.toBeNull();
    expect(currentPrice!.valueCents.value).toBe(200_00);
  });

  it("Stores the old price of the provided package in its price history", async () => {
    // Step 1: Use Basic package type (already created by seed)
    // Step 2: Add initial price of 100_00
    await addPackagePrice.execute({
      packageType: PACKAGE_TYPES.Basic,
      valueCents: 100_00,
      currency: "SEK",
      effectiveDate: new Date("2025-01-01"),
    });

    // Step 3: Add updated price of 200_00
    await addPackagePrice.execute({
      packageType: PACKAGE_TYPES.Basic,
      valueCents: 200_00,
      currency: "SEK",
      effectiveDate: new Date("2025-06-01"),
    });

    // Step 4: Check if the old price is still there in price history
    const allPrices = await getAllPricesForPackageType.execute(
      PACKAGE_TYPES.Basic
    );

    // Filter out the seeded prices (which have different dates) and get only our test prices
    const testPrices = allPrices.filter(
      (price) =>
        price.effectiveDate.getFullYear() === 2025 && !price.municipality // Standard pricing (no municipality)
    );

    // Step 5: Verify that there are two prices in the price history
    expect(testPrices.length).toBe(2);

    const oldPrice = testPrices.find(
      (price) => price.valueCents.value === 100_00
    );
    const newPrice = testPrices.find(
      (price) => price.valueCents.value === 200_00
    );

    // Step 6: Verify that the old price is 100_00 and the new price is 200_00
    expect(oldPrice).toBeDefined();
    expect(newPrice).toBeDefined();
    expect(oldPrice!.valueCents.value).toBe(100_00);
    expect(newPrice!.valueCents.value).toBe(200_00);
  });

  it("Supports adding a price for a specific municipality", async () => {
    // Step 1: Use Basic package type (already created by seed)
    // Step 2: Find the municipality (already created by seed)
    const goteborg = await getMunicipalityByName.execute("Göteborg");
    expect(goteborg).not.toBeNull();

    // Step 3: Add a price for the specific municipality
    const municipalityPrice = await addPackagePrice.execute({
      packageType: PACKAGE_TYPES.Basic,
      valueCents: 200_00,
      currency: "SEK",
      effectiveDate: new Date("2025-01-01"),
      municipalityName: "Göteborg",
    });

    // Step 4: Verify the price was set correctly
    expect(municipalityPrice.valueCents.value).toBe(200_00);
    expect(municipalityPrice.municipality).toBeDefined();
    expect(municipalityPrice.municipality!.name.value).toBe("Göteborg");

    // Step 5: Get current price for the specific municipality
    const currentPriceForMunicipality = await getCurrentPrice.execute({
      packageType: PACKAGE_TYPES.Basic,
      municipalityId: goteborg!.id,
    });

    // Step 6: Verify that the current price is 200_00
    expect(currentPriceForMunicipality).not.toBeNull();
    expect(currentPriceForMunicipality!.valueCents.value).toBe(200_00);
    // Step 7: Verify that the municipality is Göteborg
    expect(currentPriceForMunicipality!.municipality).toBeDefined();
    expect(currentPriceForMunicipality!.municipality!.name.value).toBe(
      "Göteborg"
    );
  });
});
