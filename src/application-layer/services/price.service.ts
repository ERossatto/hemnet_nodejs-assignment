import {
  IPriceRepository,
  MunicipalityId,
  PackageTypeValue,
  IPriceHistoryDomainService,
  IPriceDomainService,
  Price,
  PricingPeriod,
} from "../../domain-layer";

export class PriceService {
  constructor(
    private readonly priceRepository: IPriceRepository,
    private readonly priceHistoryDomainService: IPriceHistoryDomainService,
    private readonly priceDomainService: IPriceDomainService
  ) {}

  public async getPriceHistory(props: {
    packageType: PackageTypeValue;
    year: number;
    municipalityId?: MunicipalityId;
  }): Promise<PricingPeriod[]> {
    const { packageType, year, municipalityId } = props;

    const priceHistory =
      await this.priceHistoryDomainService.getPricingHistoryByYearAndPackageType(
        {
          packageType,
          year,
          municipalityId,
        }
      );

    return priceHistory;
  }

  public async getCurrentPrice(props: {
    packageType: PackageTypeValue;
    municipalityId?: MunicipalityId;
  }): Promise<Price | null> {
    const { packageType, municipalityId } = props;

    return await this.priceDomainService.getPriceByPackageType(
      packageType,
      municipalityId
    );
  }

  public async getAllPricesForPackageType(
    packageType: PackageTypeValue
  ): Promise<Price[]> {
    return await this.priceRepository.findByPackageType(packageType);
  }
}
