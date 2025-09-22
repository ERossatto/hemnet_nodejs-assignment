import {
  PackageTypeValue,
  PACKAGE_TYPES,
} from "../value-objects/package-type.value-object";
import { AbstractPackage } from "../entities/packages/_abstract-package.entity";
import { BasicPackage } from "../entities/packages/basic-package.entity";
import { PlusPackage } from "../entities/packages/plus-package.entity";
import { PremiumPackage } from "../entities/packages/premium-package.entity";
import { IPackageRepository } from "../repositories/package.domain-interface-repository";

export interface IPackageDomainService {
  createPackageByType(packageType: PackageTypeValue): Promise<AbstractPackage>;
}

export class PackageDomainService implements IPackageDomainService {
  constructor(private readonly packageRepository: IPackageRepository) {}

  public async createPackageByType(
    packageType: PackageTypeValue
  ): Promise<AbstractPackage> {
    const existingPackage =
      await this.packageRepository.findByPackageType(packageType);

    if (existingPackage) return existingPackage;

    let packageEntity: AbstractPackage;

    switch (packageType) {
      case PACKAGE_TYPES.Basic:
        packageEntity = BasicPackage.create();
        break;

      case PACKAGE_TYPES.Plus:
        packageEntity = PlusPackage.create();
        break;

      case PACKAGE_TYPES.Premium:
        packageEntity = PremiumPackage.create();
        break;

      default:
        throw new Error(`Unsupported package type: ${packageType}`);
    }

    await this.packageRepository.save(packageEntity);

    return packageEntity;
  }
}
