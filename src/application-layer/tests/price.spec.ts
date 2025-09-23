import { sequelizeConnection } from "../../infrastructure-layer/db-sqlite-sequelize/config";
import { seedDb } from "../../infrastructure-layer/db-sqlite-sequelize/seed";
import { PackageSequelizeRepository } from "../../infrastructure-layer/db-sqlite-sequelize/repositories/package.sequelize-repository";
import { PriceSequelizeRepository } from "../../infrastructure-layer/db-sqlite-sequelize/repositories/price.sequelize-repository";
import { MunicipalitySequelizeRepository } from "../../infrastructure-layer/db-sqlite-sequelize/repositories/municipality.sequelize-repository";
import {
  PriceDomainService,
  PriceHistoryDomainService,
} from "../../domain-layer";
import { PACKAGE_TYPES } from "../../domain-layer/value-objects/package-type.value-object";
import { MunicipalityDomainService } from "../../domain-layer/services/municipality.domain-service";

import { GetPriceHistoryUseCase } from "../use-cases/price/get-price-history.use-case";
import { AddPackagePriceUseCase } from "../use-cases/package/add-package-price.use-case";
import { GetMunicipalityByNameUseCase } from "../use-cases/municipality/get-municipality-by-name.use-case";

describe("Price Use-Cases", () => {
  // Set the db object to a variable which can be accessed throughout the whole test file
  const db = sequelizeConnection;

  // Service instances for the use-cases
  let addPackagePrice: AddPackagePriceUseCase;
  let getPriceHistory: GetPriceHistoryUseCase;
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
    const priceHistoryDomainService = new PriceHistoryDomainService(
      priceRepository
    );
    const municipalityDomainService = new MunicipalityDomainService(
      municipalityRepository
    );

    // Setup application use-cases
    addPackagePrice = new AddPackagePriceUseCase(
      packageRepository,
      priceDomainService
    );
    getPriceHistory = new GetPriceHistoryUseCase(priceHistoryDomainService);
    getMunicipalityByName = new GetMunicipalityByNameUseCase(
      municipalityDomainService
    );
  });

  afterAll(async () => {
    await db.close();
  });

  it("Returns the pricing history for the provided year and package", async () => {
    // Step 1: Create the basic package (already created by seed)
    // Step 2: Add the initial price without municipality
    await addPackagePrice.execute({
      packageType: PACKAGE_TYPES.Basic,
      valueCents: 20_00,
      currency: "SEK",
      effectiveDate: new Date("2020-01-01"),
    });

    // Step 3: Retrieve the municipalities by name
    const goteborg = await getMunicipalityByName.execute("Göteborg");
    const stockholm = await getMunicipalityByName.execute("Stockholm");

    // Step 4: Verify that the municipalities were found
    expect(goteborg).not.toBeNull();
    expect(stockholm).not.toBeNull();

    // Step 5: Add prices for 2019 (should NOT be included in 2020 results)
    const date2019 = new Date("2019-01-01");
    await Promise.all([
      addPackagePrice.execute({
        packageType: PACKAGE_TYPES.Basic,
        valueCents: 20_00,
        currency: "SEK",
        effectiveDate: date2019,
        municipalityName: "Göteborg",
      }),
      addPackagePrice.execute({
        packageType: PACKAGE_TYPES.Basic,
        valueCents: 30_00,
        currency: "SEK",
        effectiveDate: date2019,
        municipalityName: "Stockholm",
      }),
    ]);

    // Step 6: Add prices for 2020
    const date2020 = new Date("2020-01-01");
    await Promise.all([
      addPackagePrice.execute({
        packageType: PACKAGE_TYPES.Basic,
        valueCents: 30_00,
        currency: "SEK",
        effectiveDate: date2020,
        municipalityName: "Göteborg",
      }),
      addPackagePrice.execute({
        packageType: PACKAGE_TYPES.Basic,
        valueCents: 40_00,
        currency: "SEK",
        effectiveDate: date2020,
        municipalityName: "Stockholm",
      }),
      addPackagePrice.execute({
        packageType: PACKAGE_TYPES.Basic,
        valueCents: 100_00,
        currency: "SEK",
        effectiveDate: new Date("2020-06-01"),
        municipalityName: "Stockholm",
      }),
    ]);

    // Step 7: Get price history for 2020 and verify
    const priceHistory = await getPriceHistory.execute({
      packageType: PACKAGE_TYPES.Basic,
      year: 2020,
    });

    // Step 8: Verify that the price history is defined
    expect(priceHistory).toBeDefined();

    // Step 9: Verify that no prices from 2019 are included in the 2020 price history
    if (Array.isArray(priceHistory)) {
      const pricesFrom2019 = priceHistory.filter((entry: any) => {
        const effectiveDate = new Date(entry.price.props.effectiveDate);
        return effectiveDate.getFullYear() === 2019;
      });

      // Step 10: Verify that there are no prices from 2019
      expect(pricesFrom2019).toHaveLength(0);
    }
  });

  it("Supports filtering on municipality", async () => {
    // Step 1: Create the basic package (already created by seed)
    // Step 2: Add the initial price without municipality
    await addPackagePrice.execute({
      packageType: PACKAGE_TYPES.Basic,
      valueCents: 20_00,
      currency: "SEK",
      effectiveDate: new Date("2020-01-01"),
    });

    // Step 3: Create the 3 prices for 2020 with municipalities
    const date2020 = new Date("2020-01-01");
    await Promise.all([
      addPackagePrice.execute({
        packageType: PACKAGE_TYPES.Basic,
        valueCents: 20_00,
        currency: "SEK",
        effectiveDate: date2020,
        municipalityName: "Göteborg",
      }),
      addPackagePrice.execute({
        packageType: PACKAGE_TYPES.Basic,
        valueCents: 30_00,
        currency: "SEK",
        effectiveDate: date2020,
        municipalityName: "Stockholm",
      }),
      addPackagePrice.execute({
        packageType: PACKAGE_TYPES.Basic,
        valueCents: 100_00,
        currency: "SEK",
        effectiveDate: new Date("2020-06-01"),
        municipalityName: "Stockholm",
      }),
    ]);

    // Step 4: Do the assertions - test filtering by municipality
    const stockholm = await getMunicipalityByName.execute("Stockholm");
    const goteborg = await getMunicipalityByName.execute("Göteborg");

    // Step 5: Verify that the municipalities were found
    expect(stockholm).not.toBeNull();
    expect(goteborg).not.toBeNull();

    // Step 6: Get price history for 2020 and verify
    const stockholmHistory = await getPriceHistory.execute({
      packageType: PACKAGE_TYPES.Basic,
      year: 2020,
      municipalityId: stockholm!.id,
    });

    // Step 7: Get price history for 2020 and verify
    const goteborgHistory = await getPriceHistory.execute({
      packageType: PACKAGE_TYPES.Basic,
      year: 2020,
      municipalityId: goteborg!.id,
    });

    // Step 8: Get price history for 2020 and verify
    const allHistory = await getPriceHistory.execute({
      packageType: PACKAGE_TYPES.Basic,
      year: 2020,
    });

    // Step 9: Verify that the price histories are defined
    expect(stockholmHistory).toBeDefined();
    expect(goteborgHistory).toBeDefined();
    expect(allHistory).toBeDefined();

    // Step 10: Verify that the price histories are not equal
    expect(stockholmHistory).not.toEqual(allHistory);
    expect(goteborgHistory).not.toEqual(allHistory);
    expect(stockholmHistory).not.toEqual(goteborgHistory);
  });
});
