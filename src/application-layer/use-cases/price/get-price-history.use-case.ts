import {
  IPriceHistoryDomainService,
  MunicipalityId,
  PackageTypeValue,
  PricingPeriod,
} from "../../../domain-layer";
import { UseCase } from "../contracts";

export type GetPriceHistoryInput = {
  packageType: PackageTypeValue;
  year: number;
  municipalityId?: MunicipalityId;
};

export class GetPriceHistoryUseCase
  implements UseCase<GetPriceHistoryInput, PricingPeriod[]>
{
  constructor(
    private readonly priceHistoryDomainService: IPriceHistoryDomainService
  ) {}

  async execute(input: GetPriceHistoryInput): Promise<PricingPeriod[]> {
    return await this.priceHistoryDomainService.getPricingHistoryByYearAndPackageType(
      {
        packageType: input.packageType,
        year: input.year,
        municipalityId: input.municipalityId,
      }
    );
  }
}
