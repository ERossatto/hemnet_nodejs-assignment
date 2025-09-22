import { IPriceRepository } from "../repositories/price.domain-interface-repository";
import { MunicipalityId } from "../identifiers/municipality-id.identifier";
import { DateRange } from "../value-objects/date-range.value-object";
import { Price } from "../aggregates/price.aggregate";
import { PackageTypeValue } from "../value-objects/package-type.value-object";

export interface PricingPeriod {
  readonly price: Price;
  readonly effectivePeriod: DateRange;
  readonly municipalityId?: MunicipalityId;
}

export interface IPriceHistoryDomainService {
  getPricingHistoryByYearAndPackageType(props: {
    packageType: PackageTypeValue;
    year: number;
    municipalityId?: MunicipalityId;
  }): Promise<PricingPeriod[]>;
}

export class PriceHistoryDomainService implements IPriceHistoryDomainService {
  constructor(private readonly priceRepository: IPriceRepository) {}

  public async getPricingHistoryByYearAndPackageType(props: {
    packageType: PackageTypeValue;
    year: number;
    municipalityId?: MunicipalityId;
  }): Promise<PricingPeriod[]> {
    const { packageType, year, municipalityId } = props;

    const allPricesForPackage =
      await this.priceRepository.findByPackageType(packageType);

    const yearRange = DateRange.createRangeForYear(year);

    // Consider only price changes that happened within the requested year
    let relevantPrices = allPricesForPackage.filter((price) =>
      yearRange.contains(price.effectiveDate)
    );

    // If a municipality is provided, focus on changes specific to that municipality
    if (municipalityId) {
      relevantPrices = relevantPrices.filter((price) =>
        price.isApplicableToMunicipality(municipalityId)
      );
    }

    // Sort chronologically to compute effective periods between changes
    relevantPrices.sort(
      (a, b) => a.effectiveDate.getTime() - b.effectiveDate.getTime()
    );

    const pricingPeriods: PricingPeriod[] = [];

    for (let index = 0; index < relevantPrices.length; index++) {
      const current = relevantPrices[index];
      const next = relevantPrices[index + 1];

      const periodStartTime = Math.max(
        current.effectiveDate.getTime(),
        yearRange.value.startDate.getTime()
      );

      const periodStart = new Date(periodStartTime);

      const rawEndTime = next
        ? next.effectiveDate.getTime() - 1
        : yearRange.value.endDate.getTime();

      const clampedEndTime = Math.min(
        rawEndTime,
        yearRange.value.endDate.getTime()
      );

      const safeEndTime = Math.max(clampedEndTime, periodStartTime);
      const periodEnd = new Date(safeEndTime);

      const effectivePeriod = DateRange.create({
        value: { startDate: periodStart, endDate: periodEnd },
      });

      pricingPeriods.push({
        price: current,
        effectivePeriod,
        municipalityId: current.municipality?.id,
      });
    }

    return pricingPeriods;
  }
}
