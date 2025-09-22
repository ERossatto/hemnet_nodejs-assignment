import { Municipality } from "../../domain-layer";
import {
  CreateMunicipalityResponseDto,
  GetMunicipalityByNameResponseDto,
} from "../types";

/**
 * Presentation Layer Mapper for Municipality
 *
 * Responsible for converting between domain entities and presentation DTOs
 * Following Single Responsibility Principle and Clean Architecture
 */
export class MunicipalityMapper {
  /**
   * Maps Municipality domain entity to CreateMunicipalityResponseDto
   */
  static toCreateResponseDto(
    municipality: Municipality
  ): CreateMunicipalityResponseDto {
    return {
      id: municipality.id.value,
      name: municipality.name.value,
      code: municipality.code.value,
      country: municipality.country.value,
      createdAt: municipality.createdAt.toISOString(),
      updatedAt: municipality.updatedAt.toISOString(),
    };
  }

  /**
   * Maps Municipality domain entity to GetMunicipalityByNameResponseDto
   */
  static toGetByNameResponseDto(
    municipality: Municipality
  ): GetMunicipalityByNameResponseDto {
    return {
      id: municipality.id.value,
      name: municipality.name.value,
      code: municipality.code.value,
      country: municipality.country.value,
      createdAt: municipality.createdAt.toISOString(),
      updatedAt: municipality.updatedAt.toISOString(),
    };
  }
}
