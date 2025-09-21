import { Package as PackageModel } from "@infrastructure/db-sqlite-sequelize/models/package.sequelize-model";
import {
  BasicPackage,
  PremiumPackage,
  PlusPackage,
} from "@domain/entities/packages";
import { PackageId } from "@domain/identifiers/package-id.identifier";
import {
  PackageStorageCapacity,
  PackageBackupFrequency,
  PackageType,
  PACKAGE_TYPES,
} from "@domain/value-objects";

export class PackageMapper {
  static toDomain(row: PackageModel) {
    const typeValue = row.type;

    const type = PackageType.create(typeValue);
    const id = new PackageId(row.id);
    const storage = PackageStorageCapacity.create(type);
    const backup = PackageBackupFrequency.create(type);
    const createdAt = row.createdAt;
    const updatedAt = row.updatedAt;

    const props = { id, type, storage, backup, createdAt, updatedAt };

    switch (type.value) {
      case PACKAGE_TYPES.Basic:
        return new BasicPackage(props);
      case PACKAGE_TYPES.Plus:
        return new PlusPackage(props);
      case PACKAGE_TYPES.Premium:
        return new PremiumPackage(props);
      default:
        throw new Error(`Unknown package type: ${type.value}`);
    }
  }
}
