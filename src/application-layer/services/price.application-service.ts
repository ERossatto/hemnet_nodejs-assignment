import {
  IPriceRepository,
  MunicipalityId,
  PackageTypeValue,
  IPriceHistoryDomainService,
  IPriceDomainService,
  Price,
  PricingPeriod,
  ValueCents,
  Currency,
  IMunicipalityRepository,
  MunicipalityName,
} from "../../domain-layer";

export interface PriceCreationProps {
  packageType: PackageTypeValue;
  valueCents: number;
  currency: string;
  effectiveDate: Date;
  municipalityName?: string;
}

export interface IPriceApplicationService {
  getPriceHistory(props: {
    packageType: PackageTypeValue;
    year: number;
    municipalityId?: MunicipalityId;
  }): Promise<PricingPeriod[]>;

  getCurrentPrice(props: {
    packageType: PackageTypeValue;
    municipalityId?: MunicipalityId;
  }): Promise<Price | null>;

  getAllPricesForPackageType(packageType: PackageTypeValue): Promise<Price[]>;

  createPrice(props: PriceCreationProps): Promise<Price>;
}

export class PriceApplicationService implements IPriceApplicationService {
  constructor(
    private readonly priceRepository: IPriceRepository,
    private readonly priceHistoryDomainService: IPriceHistoryDomainService,
    private readonly priceDomainService: IPriceDomainService,
    private readonly municipalityRepository: IMunicipalityRepository
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

  public async createPrice(props: PriceCreationProps): Promise<Price> {
    const valueCentsObject = ValueCents.create(props.valueCents);
    const currencyObject = Currency.create(props.currency);
    const effectiveDateObject = new Date(props.effectiveDate);

    let municipalityId = undefined;
    if (props.municipalityName) {
      const municipalityNameObject = MunicipalityName.create(
        props.municipalityName
      );
      const municipalityObject = await this.municipalityRepository.findByName(
        municipalityNameObject
      );

      if (!municipalityObject) {
        // TODO: shall we throw or create? to create we need code and country
        throw new Error(
          `Municipality with name ${props.municipalityName} not found`
        );
      }

      municipalityId = municipalityObject.id;
    }

    const newPrice = await this.priceDomainService.createPriceForPackageType({
      packageType: props.packageType,
      valueCents: valueCentsObject,
      currency: currencyObject,
      effectiveDate: effectiveDateObject,
      municipalityId,
    });

    return newPrice;
  }
}
