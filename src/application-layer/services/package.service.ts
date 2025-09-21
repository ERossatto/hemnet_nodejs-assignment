import {
  Currency,
  IMunicipalityRepository,
  IPackageRepository,
  MunicipalityName,
  IPackageDomainService,
  PackageTypeValue,
  IPriceDomainService,
  ValueCents,
} from "../../domain-layer";

export class PackageService {
  constructor(
    private readonly packageRepository: IPackageRepository,
    private readonly municipalityRepository: IMunicipalityRepository,
    private readonly priceDomainService: IPriceDomainService,
    private readonly packageDomainService: IPackageDomainService
  ) {}

  async addPackagePrice(props: {
    packageType: PackageTypeValue;
    valueCents: number;
    currency: string;
    effectiveDate: Date;
    municipalityName?: string;
  }) {
    const packageEntity = await this.packageRepository.findByPackageType(
      props.packageType
    );

    if (!packageEntity) {
      throw new Error(`Package with type ${props.packageType} not found`);
    }

    const newPrice = await this._createPrice({
      ...props,
    });

    return newPrice;
  }

  async createPackage(props: {
    packageType: PackageTypeValue;
    valueCents: number;
    currency: string;
    effectiveDate: Date;
    municipalityName?: string;
  }) {
    await this.packageDomainService.createPackageByType(props.packageType);

    const newPrice = await this._createPrice({
      ...props,
    });

    return newPrice;
  }

  private async _createPrice(props: {
    packageType: PackageTypeValue;
    valueCents: number;
    currency: string;
    effectiveDate: Date;
    municipalityName?: string;
  }) {
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
