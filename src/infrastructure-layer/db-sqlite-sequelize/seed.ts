import { Package } from "@infrastructure/db-sqlite-sequelize/models/package.sequelize-model";
import { Price } from "@infrastructure/db-sqlite-sequelize/models/price.sequelize-model";
import { Municipality } from "@infrastructure/db-sqlite-sequelize/models/municipality.sequelize-model";
import { PACKAGE_TYPES } from "@domain/value-objects/package-type.value-object";
import { STORAGE_SIZES_IN_GB } from "@domain/value-objects/package-storage-capacity.value-object";
import { BACKUP_FREQUENCY_TYPES } from "@domain/value-objects/package-backup-frequency.value-object";
import { generateUUID } from "@domain/helpers/uuid.domain-helper";

export const seedDb = async () => {
  // Clean up existing data
  await Price.destroy({ truncate: true });
  await Package.destroy({ truncate: true });
  await Municipality.destroy({ truncate: true });

  // Seed municipalities first (since prices can reference them)
  const stockholmId = generateUUID();
  const gothenburgId = generateUUID();
  const malmoId = generateUUID();

  await Municipality.bulkCreate(
    [
      {
        id: stockholmId,
        name: "Stockholm",
        code: "0180",
        country: "Sweden",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: gothenburgId,
        name: "Gothenburg",
        code: "1480",
        country: "Sweden",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: malmoId,
        name: "Malmö",
        code: "1280",
        country: "Sweden",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    { validate: true }
  );

  // Seed packages with new structure
  const basicId = generateUUID();
  const plusId = generateUUID();
  const premiumId = generateUUID();

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
  const stockholm = (await Municipality.findOne({
    where: { name: "Stockholm" },
  })) as Municipality;
  const gothenburg = (await Municipality.findOne({
    where: { name: "Gothenburg" },
  })) as Municipality;
  const malmo = (await Municipality.findOne({
    where: { name: "Malmö" },
  })) as Municipality;

  // Seed prices with new structure (including currency, effectiveDate, and optional municipalityId)
  const baseDate = new Date("2024-01-01");

  // Basic package prices (general and municipality-specific)
  await Price.bulkCreate(
    [
      {
        id: generateUUID(),
        priceCents: 5000,
        packageId: basic.id,
        currency: "SEK",
        effectiveDate: baseDate,
        municipalityId: null, // General price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateUUID(),
        priceCents: 10_000,
        packageId: basic.id,
        currency: "SEK",
        effectiveDate: new Date("2024-06-01"),
        municipalityId: stockholm.id, // Stockholm-specific price
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
        id: generateUUID(),
        priceCents: 19_990,
        packageId: plus.id,
        currency: "SEK",
        effectiveDate: baseDate,
        municipalityId: null, // General price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateUUID(),
        priceCents: 29_900,
        packageId: plus.id,
        currency: "SEK",
        effectiveDate: new Date("2024-03-01"),
        municipalityId: gothenburg.id, // Gothenburg-specific price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateUUID(),
        priceCents: 39_900,
        packageId: plus.id,
        currency: "SEK",
        effectiveDate: new Date("2024-09-01"),
        municipalityId: malmo.id, // Malmö-specific price
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
        id: generateUUID(),
        priceCents: 55_000,
        packageId: premium.id,
        currency: "SEK",
        effectiveDate: baseDate,
        municipalityId: null, // General price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateUUID(),
        priceCents: 66_600,
        packageId: premium.id,
        currency: "SEK",
        effectiveDate: new Date("2024-02-01"),
        municipalityId: stockholm.id, // Stockholm-specific price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateUUID(),
        priceCents: 77_700,
        packageId: premium.id,
        currency: "SEK",
        effectiveDate: new Date("2024-05-01"),
        municipalityId: gothenburg.id, // Gothenburg-specific price
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateUUID(),
        priceCents: 88_800,
        packageId: premium.id,
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
