import { Price } from "../../domain-layer";
import { AddPackagePriceResponseDto, CreatePackageResponseDto } from "../types";

/**
 * Presentation Layer Mapper for Package
 *
 * Responsible for converting between domain entities and presentation DTOs
 * Following Single Responsibility Principle and Clean Architecture
 */
export class PackageMapper {
  /**
   * Maps Price domain entity to the price structure used in package responses
   */
  private static toPriceStructure(price: Price) {
    return {
      id: price.id.value,
      valueCents: price.valueCents.value,
      currency: price.currency.value,
      effectiveDate: price.effectiveDate.toISOString(),
      packageType: price.packageType.value,
      municipalityId: price.municipalityId?.value,
    };
  }

  /**
   * Maps Price entity to AddPackagePriceResponseDto
   */
  static toAddPackagePriceResponseDto(
    price: Price
  ): AddPackagePriceResponseDto {
    return {
      price: this.toPriceStructure(price),
    };
  }

  /**
   * Maps Price entity to CreatePackageResponseDto
   */
  static toCreatePackageResponseDto(price: Price): CreatePackageResponseDto {
    return {
      price: this.toPriceStructure(price),
    };
  }
}
