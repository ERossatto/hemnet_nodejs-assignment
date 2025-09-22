import {
  BasicPackage,
  PlusPackage,
  PremiumPackage,
} from "../entities/packages";
import { PackageTypeValue } from "../value-objects/package-type.value-object";

type Package = BasicPackage | PlusPackage | PremiumPackage;

export interface IPackageRepository {
  findByPackageType(packageType: PackageTypeValue): Promise<Package | null>;
  save(packageEntity: Package): Promise<void>;
}
