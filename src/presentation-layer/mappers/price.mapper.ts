import { Price, PricingPeriod } from "../../domain-layer";
import {
  PriceDto,
  PricingPeriodDto,
  GetPriceHistoryResponseDto,
  GetCurrentPriceResponseDto,
  GetAllPricesForPackageTypeResponseDto,
  CreatePriceResponseDto,
} from "../types";

/**
 * Presentation Layer Mapper for Price
 *
 * Responsible for converting between domain entities and presentation DTOs
 * Following Single Responsibility Principle and Clean Architecture
 */
export class PriceMapper {
  /**
   * Maps Price domain entity to PriceDto
   */
  static toPriceDto(price: Price): PriceDto {
    return {
      id: price.id.value,
      valueCents: price.valueCents.value,
      currency: price.currency.value,
      effectiveDate: price.effectiveDate.toISOString(),
      packageType: price.package.type.value,
      municipalityId: price.municipality?.id.value,
      municipalityName: price.municipality?.name.value,
    };
  }

  /**
   * Maps PricingPeriod domain object to PricingPeriodDto
   */
  static toPricingPeriodDto(period: PricingPeriod): PricingPeriodDto {
    return {
      id: period.price.id.value,
      valueCents: period.price.valueCents.value,
      currency: period.price.currency.value,
      effectiveDate: period.effectivePeriod.value.startDate.toISOString(),
      endDate: period.effectivePeriod.value.endDate?.toISOString(),
    };
  }

  /**
   * Maps array of PricingPeriod to GetPriceHistoryResponseDto
   */
  static toGetPriceHistoryResponseDto(
    pricingPeriods: PricingPeriod[]
  ): GetPriceHistoryResponseDto {
    return {
      pricingPeriods: pricingPeriods.map(this.toPricingPeriodDto),
    };
  }

  /**
   * Maps Price entity (or null) to GetCurrentPriceResponseDto
   */
  static toGetCurrentPriceResponseDto(
    price: Price | null
  ): GetCurrentPriceResponseDto {
    return {
      price: price ? this.toPriceDto(price) : null,
    };
  }

  /**
   * Maps array of Price entities to GetAllPricesForPackageTypeResponseDto
   */
  static toGetAllPricesForPackageTypeResponseDto(
    prices: Price[]
  ): GetAllPricesForPackageTypeResponseDto {
    return {
      prices: prices.map(this.toPriceDto),
    };
  }

  /**
   * Maps Price entity to CreatePriceResponseDto
   */
  static toCreatePriceResponseDto(price: Price): CreatePriceResponseDto {
    return {
      price: this.toPriceDto(price),
    };
  }
}
