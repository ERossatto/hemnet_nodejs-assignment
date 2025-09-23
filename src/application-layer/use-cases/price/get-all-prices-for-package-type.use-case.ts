import {
  IPriceRepository,
  PackageTypeValue,
  Price,
} from "../../../domain-layer";
import { UseCase } from "../contracts";

export class GetAllPricesForPackageTypeUseCase
  implements UseCase<PackageTypeValue, Price[]>
{
  constructor(private readonly priceRepository: IPriceRepository) {}

  async execute(packageType: PackageTypeValue): Promise<Price[]> {
    return await this.priceRepository.findManyByPackageType(packageType);
  }
}
