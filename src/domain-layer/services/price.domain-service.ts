import { IPriceRepository } from "../repositories/price.domain-interface-repository";
import { MunicipalityId } from "../identifiers/municipality-id.identifier";
import { ValueCents } from "../value-objects/value-cents.value-object";
import { Currency } from "../value-objects/currency.value-object";
import { Price } from "../aggregates/price.aggregate";
import { IPackageRepository } from "../repositories/package.domain-interface-repository";
import { Municipality } from "../entities/municipality.entity";
import { IMunicipalityRepository } from "../repositories/municipality.domain-interface-repository";
import { PackageTypeValue } from "../value-objects/package-type.value-object";

export interface IPriceDomainService {
  getCurrentPriceByPackageType(
    packageType: PackageTypeValue,
    municipalityId?: MunicipalityId
  ): Promise<Price | null>;
  createPriceForPackageType(props: {
    packageType: PackageTypeValue;
    valueCents: ValueCents;
    currency: Currency;
    effectiveDate: Date;
    municipalityId?: MunicipalityId;
  }): Promise<Price>;
}

export class PriceDomainService implements IPriceDomainService {
  constructor(
    private readonly priceRepository: IPriceRepository,
    private readonly packageRepository: IPackageRepository,
    private readonly municipalityRepository: IMunicipalityRepository
  ) {}

  public async getCurrentPriceByPackageType(
    packageType: PackageTypeValue,
    municipalityId?: MunicipalityId
  ): Promise<Price | null> {
    const packageEntity =
      await this.packageRepository.findByPackageType(packageType);

    if (!packageEntity) {
      throw new Error(`Package with type ${packageType} not found`);
    }

    let municipalityExists = false;
    if (municipalityId) {
      const foundMunicipality =
        await this.municipalityRepository.findById(municipalityId);
      if (!foundMunicipality) {
        throw new Error(
          `Municipality with id ${municipalityId.value} not found`
        );
      }
      municipalityExists = true;
    }

    const now = new Date();
    const allPricesForPackage =
      await this.priceRepository.findManyByPackageType(packageType);

    const effectivePrices = allPricesForPackage.filter(
      (p) => p.package.id.equals(packageEntity.id) && p.effectiveDate <= now
    );

    if (municipalityId && municipalityExists) {
      const municipalCandidates = effectivePrices
        .filter((p) => p.municipality?.id.equals(municipalityId))
        .sort((a, b) => b.effectiveDate.getTime() - a.effectiveDate.getTime());

      if (municipalCandidates.length > 0) {
        return municipalCandidates[0];
      }
    }

    const standardCandidates = effectivePrices
      .filter((p) => p.isStandardPricing())
      .sort((a, b) => b.effectiveDate.getTime() - a.effectiveDate.getTime());

    return standardCandidates[0] ?? null;
  }

  public async createPriceForPackageType(props: {
    packageType: PackageTypeValue;
    valueCents: ValueCents;
    currency: Currency;
    effectiveDate: Date;
    municipalityId?: MunicipalityId;
  }): Promise<Price> {
    const packageEntity = await this.packageRepository.findByPackageType(
      props.packageType
    );

    if (!packageEntity) {
      throw new Error(`Package with type ${props.packageType} not found`);
    }

    let municipality: Municipality | undefined = undefined;

    if (props.municipalityId) {
      const foundMunicipality = await this.municipalityRepository.findById(
        props.municipalityId
      );

      if (!foundMunicipality) {
        throw new Error(
          `Municipality with id ${props.municipalityId.value} not found`
        );
      }

      municipality = foundMunicipality;
    }

    const newPrice = Price.create({
      package: packageEntity,
      valueCents: props.valueCents,
      currency: props.currency,
      effectiveDate: props.effectiveDate,
      municipality,
    });

    await this.priceRepository.save(newPrice);

    /*
     * Return the created price for convenience.
     * So we don't have to fetch again if we need to use it immediately.
     */
    return newPrice;
  }
}
