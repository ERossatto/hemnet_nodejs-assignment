import { PackageTypeValue } from "../value-objects/package-type.value-object";
import { Price } from "../aggregates/price.aggregate";

export interface IPriceRepository {
  findManyByPackageType(packageType: PackageTypeValue): Promise<Price[]>;
  save(price: Price): Promise<void>;
}
