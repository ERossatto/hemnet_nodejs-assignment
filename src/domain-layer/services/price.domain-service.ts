import { IPriceRepository } from "../repositories/price.domain-interface-repository";
import { MunicipalityId } from "../identifiers/municipality-id.identifier";
import { ValueCents } from "../value-objects/value-cents.value-object";
import { Currency } from "../value-objects/currency.value-object";
import { Price } from "../aggregates/price.aggregate";
import { IPackageRepository } from "../repositories/package.domain-interface-repository";
import { Municipality } from "../entities/municipality.entity";
import { IMunicipalityRepository } from "../repositories/municipality.domain-interface-repository";
import { PackageType } from "../value-objects/package-type.value-object";
import { MunicipalityName } from "../value-objects/municipality-name.value-object";

export interface IPriceDomainService {
  getCurrentPriceByPackageType(
    packageType: PackageType,
    municipalityId?: MunicipalityId
  ): Promise<Price | null>;
  createPriceForPackageType(props: {
    packageType: PackageType;
    valueCents: ValueCents;
    currency: Currency;
    effectiveDate: Date;
    municipalityName?: MunicipalityName;
  }): Promise<Price>;
}

export class PriceDomainService implements IPriceDomainService {
  constructor(
    private readonly priceRepository: IPriceRepository,
    private readonly packageRepository: IPackageRepository,
    private readonly municipalityRepository: IMunicipalityRepository
  ) {}

  public async getCurrentPriceByPackageType(
    packageType: PackageType,
    municipalityId?: MunicipalityId
  ): Promise<Price | null> {
    const packageEntity = await this.packageRepository.findByPackageType(
      packageType.value
    );

    if (!packageEntity) {
      throw new Error(`Package with type ${packageType.value} not found`);
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
      await this.priceRepository.findManyByPackageType(packageType.value);

    const effectivePrices = allPricesForPackage.filter(
      (p) => p.packageType.isEqual(packageType) && p.effectiveDate <= now
    );

    if (municipalityId && municipalityExists) {
      const municipalCandidates = effectivePrices
        .filter((p) => p.municipalityId?.equals(municipalityId))
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
    packageType: PackageType;
    valueCents: ValueCents;
    currency: Currency;
    effectiveDate: Date;
    municipalityName?: MunicipalityName;
  }): Promise<Price> {
    const packageEntity = await this.packageRepository.findByPackageType(
      props.packageType.value
    );

    if (!packageEntity) {
      throw new Error(`Package with type ${props.packageType.value} not found`);
    }

    let municipality: Municipality | undefined = undefined;

    if (props.municipalityName) {
      const foundMunicipality = await this.municipalityRepository.findByName(
        props.municipalityName
      );

      if (!foundMunicipality) {
        throw new Error(
          `Municipality with name ${props.municipalityName.value} not found`
        );
      }

      municipality = foundMunicipality;
    }

    const newPrice = Price.create({
      packageType: props.packageType,
      valueCents: props.valueCents,
      currency: props.currency,
      effectiveDate: props.effectiveDate,
      municipalityId: municipality?.id,
    });

    await this.priceRepository.save(newPrice);

    /*
     * Return the created price for convenience.
     * So we don't have to fetch again if we need to use it immediately.
     */
    return newPrice;
  }
}
