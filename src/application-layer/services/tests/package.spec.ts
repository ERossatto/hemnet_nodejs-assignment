import { sequelizeConnection } from "../../../infrastructure-layer/db-sqlite-sequelize/config";
import { seedDb } from "../../../infrastructure-layer/db-sqlite-sequelize/seed";
import { PackageApplicationService } from "../package.application-service";
import { PriceApplicationService } from "../price.application-service";
import { MunicipalityApplicationService } from "../municipality.application-service";
import { PackageSequelizeRepository } from "../../../infrastructure-layer/db-sqlite-sequelize/repositories/package.sequelize-repository";
import { PriceSequelizeRepository } from "../../../infrastructure-layer/db-sqlite-sequelize/repositories/price.sequelize-repository";
import { MunicipalitySequelizeRepository } from "../../../infrastructure-layer/db-sqlite-sequelize/repositories/municipality.sequelize-repository";
import {
  PriceDomainService,
  PackageDomainService,
  PriceHistoryDomainService,
} from "../../../domain-layer";
import { PACKAGE_TYPES } from "../../../domain-layer/value-objects/package-type.value-object";

describe("PackageService", () => {
  // Set the db object to a variable which can be accessed throughout the whole test file
  const db = sequelizeConnection;

  // Service instances
  let packageService: PackageApplicationService;
  let priceService: PriceApplicationService;
  let municipalityService: MunicipalityApplicationService;

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
    const packageDomainService = new PackageDomainService(packageRepository);
    const priceHistoryDomainService = new PriceHistoryDomainService(
      priceRepository
    );

    // Setup application services
    priceService = new PriceApplicationService(
      priceRepository,
      priceHistoryDomainService,
      priceDomainService,
      municipalityRepository
    );

    packageService = new PackageApplicationService(
      packageRepository,
      packageDomainService,
      priceService
    );

    municipalityService = new MunicipalityApplicationService(
      municipalityRepository
    );
  });

  afterAll(async () => {
    await db.close();
  });

  it("Updates the current price of the provided package", async () => {
    // ORIGINAL IMPLEMENTATION
    /*
      const pack = await Package.create({ name: "Dunderhonung", priceCents: 0 });

      const newPackage = await packageService.updatePackagePrice(pack, 200_00);

      expect(newPackage.priceCents).toBe(200_00);
    */

    // Step 1: Use Basic package type (already created by seed)
    // Step 2: Add initial price of 0 (use a future date to override seeded data)
    await packageService.addPackagePrice({
      packageType: PACKAGE_TYPES.Basic,
      valueCents: 0,
      currency: "SEK",
      effectiveDate: new Date("2025-01-01"),
    });

    // Step 3: Add updated price of 200_00 (even more recent date)
    const newPrice = await packageService.addPackagePrice({
      packageType: PACKAGE_TYPES.Basic,
      valueCents: 200_00,
      currency: "SEK",
      effectiveDate: new Date("2025-06-01"),
    });

    // Step 4: Verify the new price has valueCents 200_00
    expect(newPrice.valueCents.value).toBe(200_00);

    // Step 5: Verify that getting current price returns the latest price
    const currentPrice = await priceService.getCurrentPrice({
      packageType: PACKAGE_TYPES.Basic,
    });

    expect(currentPrice).not.toBeNull();
    expect(currentPrice!.valueCents.value).toBe(200_00);
  });

  it("Stores the old price of the provided package in its price history", async () => {
    // ORIGINAL IMPLEMENTATION
    /*
      const pack = await Package.create({
        name: "Dunderhonung",
        priceCents: 100_00,
      });
      await packageService.updatePackagePrice(pack, 200_00);
      const priceHistory = await Price.findAll({ where: { packageId: pack.id } });
      expect(priceHistory.length).toBe(1);
      expect(priceHistory[0].priceCents).toBe(100_00);
    */

    // Step 1: Use Basic package type (already created by seed)
    // Step 2: Add initial price of 100_00
    await packageService.addPackagePrice({
      packageType: PACKAGE_TYPES.Basic,
      valueCents: 100_00,
      currency: "SEK",
      effectiveDate: new Date("2025-01-01"),
    });

    // Step 3: Add updated price of 200_00
    await packageService.addPackagePrice({
      packageType: PACKAGE_TYPES.Basic,
      valueCents: 200_00,
      currency: "SEK",
      effectiveDate: new Date("2025-06-01"),
    });

    // Step 4: Check if the old price is still there in price history
    const allPrices = await priceService.getAllPricesForPackageType(
      PACKAGE_TYPES.Basic
    );

    // Filter out the seeded prices (which have different dates) and get only our test prices
    const testPrices = allPrices.filter(
      (price) =>
        price.effectiveDate.getFullYear() === 2025 && !price.municipality // Standard pricing (no municipality)
    );

    expect(testPrices.length).toBe(2);

    // Find the old price (100_00) and new price (200_00)
    const oldPrice = testPrices.find(
      (price) => price.valueCents.value === 100_00
    );
    const newPrice = testPrices.find(
      (price) => price.valueCents.value === 200_00
    );

    expect(oldPrice).toBeDefined();
    expect(newPrice).toBeDefined();
    expect(oldPrice!.valueCents.value).toBe(100_00);
    expect(newPrice!.valueCents.value).toBe(200_00);
  });

  // This tests cover feature request 1. Feel free to add more tests or change
  // the existing one.
  it("Supports adding a price for a specific municipality", async () => {
    // ORIGINAL IMPLEMENTATION
    /*
      const pack = await Package.create({ name: "Dunderhonung", priceCents: 0 });
      await packageService.updatePackagePrice(pack, 200_00, "Göteborg");
      const response = await packageService.priceFor("Göteborg");
      expect(response).toBe(200_00);
    */

    // Step 1: Use Basic package type (already created by seed)
    // Step 2: Find the municipality (already created by seed)
    const goteborg =
      await municipalityService.getMunicipalityByName("Göteborg");
    expect(goteborg).not.toBeNull();

    // Step 3: Add a price for the specific municipality
    const municipalityPrice = await packageService.addPackagePrice({
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
    const currentPriceForMunicipality = await priceService.getCurrentPrice({
      packageType: PACKAGE_TYPES.Basic,
      municipalityId: goteborg!.id,
    });

    expect(currentPriceForMunicipality).not.toBeNull();
    expect(currentPriceForMunicipality!.valueCents.value).toBe(200_00);
    expect(currentPriceForMunicipality!.municipality).toBeDefined();
    expect(currentPriceForMunicipality!.municipality!.name.value).toBe(
      "Göteborg"
    );
  });
});
