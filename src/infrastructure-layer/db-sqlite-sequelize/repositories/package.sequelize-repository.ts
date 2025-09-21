import { IPackageRepository } from "@domain/repositories/package.domain-interface-repository";
import { BasicPackage } from "@domain/entities/packages/basic-package.entity";
import { PlusPackage } from "@domain/entities/packages/plus-package.entity";
import { PremiumPackage } from "@domain/entities/packages/premium-package.entity";
import { PackageTypeValue } from "@domain/value-objects/package-type.value-object";
import { Package as PackageModel } from "@infrastructure/db-sqlite-sequelize/models/package.sequelize-model";
import { PackageMapper } from "@infrastructure/db-sqlite-sequelize/mappers/package.infrastructure-mapper";

export class PackageSequelizeRepository implements IPackageRepository {
  async findByPackageType(
    packageType: PackageTypeValue
  ): Promise<BasicPackage | PlusPackage | PremiumPackage | null> {
    const row = await PackageModel.findOne({ where: { type: packageType } });
    return row ? PackageMapper.toDomain(row) : null;
  }

  async save(pkg: BasicPackage | PlusPackage | PremiumPackage): Promise<void> {
    const packageData = {
      id: pkg.id.value,
      type: pkg.type.value,
      storageGb: pkg.storage.value.storegeSize,
      backupFrequency: pkg.backup.value.backupFrequency,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    };

    await PackageModel.upsert(packageData);
  }
}
