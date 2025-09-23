import {
  IPriceDomainService,
  PackageTypeValue,
  Price,
  MunicipalityId,
} from "../../../domain-layer";
import { UseCase } from "../contracts";

export type GetCurrentPriceInput = {
  packageType: PackageTypeValue;
  municipalityId?: MunicipalityId;
};

export class GetCurrentPriceUseCase
  implements UseCase<GetCurrentPriceInput, Price | null>
{
  constructor(private readonly priceDomainService: IPriceDomainService) {}

  async execute(input: GetCurrentPriceInput): Promise<Price | null> {
    return await this.priceDomainService.getCurrentPriceByPackageType(
      input.packageType,
      input.municipalityId
    );
  }
}
