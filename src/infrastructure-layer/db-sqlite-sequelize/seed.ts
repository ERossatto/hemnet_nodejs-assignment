import { Package } from "./models/package.sequelize-model";
import { Price } from "./models/price.sequelize-model";
import { Municipality } from "./models/municipality.sequelize-model";
import { PACKAGE_TYPES } from "../../domain-layer/value-objects/package-type.value-object";
import { STORAGE_SIZES_IN_GB } from "../../domain-layer/value-objects/package-storage-capacity.value-object";
import { BACKUP_FREQUENCY_TYPES } from "../../domain-layer/value-objects/package-backup-frequency.value-object";
import { randomUUID } from "crypto";

export const seedDb = async () => {
  // Clean up existing data
  await Price.destroy({ truncate: true });
  await Package.destroy({ truncate: true });
  await Municipality.destroy({ truncate: true });

  // Seed municipalities first (since prices can reference them)
  const stockholm = {
    id: randomUUID(),
    name: "Stockholm",
    code: "0180",
    country: "Sweden",
  };
  const gothenburg = {
    id: randomUUID(),
    name: "Göteborg",
    code: "1480",
    country: "Sweden",
  };

  const malmo = {
    id: randomUUID(),
    name: "Malmö",
    code: "1280",
    country: "Sweden",
  };

  await Municipality.bulkCreate(
    [
      {
        id: stockholm.id,
        name: stockholm.name,
        code: stockholm.code,
        country: stockholm.country,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: gothenburg.id,
        name: gothenburg.name,
        code: gothenburg.code,
        country: gothenburg.country,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: malmo.id,
        name: malmo.name,
        code: malmo.code,
        country: malmo.country,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    { validate: true }
  );

  // Seed packages with new structure
  const basicId = randomUUID();
  const plusId = randomUUID();
  const premiumId = randomUUID();

  await Package.bulkCreate(
    [
      {
        id: basicId,
        type: PACKAGE_TYPES.Basic,
        storageGb: STORAGE_SIZES_IN_GB.BASIC,
        backupFrequency: BACKUP_FREQUENCY_TYPES.NONE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: plusId,
        type: PACKAGE_TYPES.Plus,
        storageGb: STORAGE_SIZES_IN_GB.PLUS,
        backupFrequency: BACKUP_FREQUENCY_TYPES.ONCE_PER_WEEK,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: premiumId,
        type: PACKAGE_TYPES.Premium,
        storageGb: STORAGE_SIZES_IN_GB.PREMIUM,
        backupFrequency: BACKUP_FREQUENCY_TYPES.ON_EVERY_UPDATE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    { validate: true }
  );

  const basic = (await Package.findOne({
    where: { type: PACKAGE_TYPES.Basic },
  })) as Package;

  const plus = (await Package.findOne({
    where: { type: PACKAGE_TYPES.Plus },
  })) as Package;

  const premium = (await Package.findOne({
    where: { type: PACKAGE_TYPES.Premium },
  })) as Package;

  // Get municipalities for price seeding
  const stockholmFromDb = (await Municipality.findOne({
    where: { name: stockholm.name },
  })) as Municipality;
  const gothenburgFromDb = (await Municipality.findOne({
    where: { name: gothenburg.name },
  })) as Municipality;
  const malmoFromDb = (await Municipality.findOne({
    where: { name: malmo.name },
  })) as Municipality;

  // Seed prices with new structure (including currency, effectiveDate, and optional municipalityId)
  const baseDate = new Date("2024-01-01");

  // Basic package prices (general and municipality-specific)
  await Price.bulkCreate(
    [
      {
        id: randomUUID(),
        priceCents: 5000,
        packageType: PACKAGE_TYPES.Basic,
        currency: "SEK",
        effectiveDate: baseDate,
        municipalityId: null, // General price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        priceCents: 10_000,
        packageType: PACKAGE_TYPES.Basic,
        currency: "SEK",
        effectiveDate: new Date("2024-06-01"),
        municipalityId: stockholmFromDb.id, // Stockholm-specific price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    { validate: true }
  );

  // Plus package prices
  await Price.bulkCreate(
    [
      {
        id: randomUUID(),
        priceCents: 19_990,
        packageType: PACKAGE_TYPES.Plus,
        currency: "SEK",
        effectiveDate: baseDate,
        municipalityId: null, // General price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        priceCents: 29_900,
        packageType: PACKAGE_TYPES.Plus,
        currency: "SEK",
        effectiveDate: new Date("2024-03-01"),
        municipalityId: gothenburgFromDb.id, // Gothenburg-specific price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        priceCents: 39_900,
        packageType: PACKAGE_TYPES.Plus,
        currency: "SEK",
        effectiveDate: new Date("2024-09-01"),
        municipalityId: malmoFromDb.id, // Malmö-specific price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    { validate: true }
  );

  // Premium package prices
  await Price.bulkCreate(
    [
      {
        id: randomUUID(),
        priceCents: 55_000,
        packageType: PACKAGE_TYPES.Premium,
        currency: "SEK",
        effectiveDate: baseDate,
        municipalityId: null, // General price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        priceCents: 66_600,
        packageType: PACKAGE_TYPES.Premium,
        currency: "SEK",
        effectiveDate: new Date("2024-02-01"),
        municipalityId: stockholm.id, // Stockholm-specific price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        priceCents: 77_700,
        packageType: PACKAGE_TYPES.Premium,
        currency: "SEK",
        effectiveDate: new Date("2024-05-01"),
        municipalityId: gothenburg.id, // Gothenburg-specific price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        priceCents: 88_800,
        packageType: PACKAGE_TYPES.Premium,
        currency: "SEK",
        effectiveDate: new Date("2024-08-01"),
        municipalityId: malmo.id, // Malmö-specific price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    { validate: true }
  );
};
