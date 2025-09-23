import { IPriceApplicationService } from "../../application-layer/services/price.application-service";
import { PackageTypeValue, MunicipalityId } from "../../domain-layer";
import {
  GetPriceHistoryRequestDto,
  GetPriceHistoryResponseDto,
  GetCurrentPriceRequestDto,
  GetCurrentPriceResponseDto,
  GetAllPricesForPackageTypeRequestDto,
  GetAllPricesForPackageTypeResponseDto,
  CreatePriceRequestDto,
  CreatePriceResponseDto,
} from "../types";
import { PriceMapper } from "../mappers";
import { BadRequestError } from "../errors/http-errors";

export interface IPriceController {
  getPriceHistory(
    req: GetPriceHistoryRequestDto
  ): Promise<GetPriceHistoryResponseDto>;
  getCurrentPrice(
    req: GetCurrentPriceRequestDto
  ): Promise<GetCurrentPriceResponseDto>;
  getAllPricesForPackageType(
    req: GetAllPricesForPackageTypeRequestDto
  ): Promise<GetAllPricesForPackageTypeResponseDto>;
  createPrice(req: CreatePriceRequestDto): Promise<CreatePriceResponseDto>;
}

export class PriceController implements IPriceController {
  constructor(
    private readonly priceApplicationService: IPriceApplicationService
  ) {}

  public async getPriceHistory(
    req: GetPriceHistoryRequestDto
  ): Promise<GetPriceHistoryResponseDto> {
    const { packageType, year, municipalityId } = req;

    if (!packageType || !year) {
      throw new BadRequestError(
        "Missing required query parameters: packageType and year are required"
      );
    }

    const yearNum = parseInt(String(year), 10);
    if (isNaN(yearNum)) {
      throw new BadRequestError("Year must be a valid number");
    }

    const municipalityIdObj = municipalityId
      ? new MunicipalityId(municipalityId)
      : undefined;

    const pricingPeriods = await this.priceApplicationService.getPriceHistory({
      packageType: packageType as PackageTypeValue,
      year: yearNum,
      municipalityId: municipalityIdObj,
    });

    return PriceMapper.toGetPriceHistoryResponseDto(pricingPeriods);
  }

  public async getCurrentPrice(
    req: GetCurrentPriceRequestDto
  ): Promise<GetCurrentPriceResponseDto> {
    const { packageType, municipalityId } = req;

    if (!packageType) {
      throw new BadRequestError(
        "Missing required query parameter: packageType"
      );
    }

    const municipalityIdObj = municipalityId
      ? new MunicipalityId(municipalityId)
      : undefined;

    const price = await this.priceApplicationService.getCurrentPrice({
      packageType: packageType as PackageTypeValue,
      municipalityId: municipalityIdObj,
    });

    return PriceMapper.toGetCurrentPriceResponseDto(price);
  }

  public async getAllPricesForPackageType(
    req: GetAllPricesForPackageTypeRequestDto
  ): Promise<GetAllPricesForPackageTypeResponseDto> {
    const { packageType } = req;

    if (!packageType) {
      throw new BadRequestError("Missing required parameter: packageType");
    }

    const prices =
      await this.priceApplicationService.getAllPricesForPackageType(
        packageType as PackageTypeValue
      );

    return PriceMapper.toGetAllPricesForPackageTypeResponseDto(prices);
  }

  public async createPrice(
    req: CreatePriceRequestDto
  ): Promise<CreatePriceResponseDto> {
    const {
      packageType,
      valueCents,
      currency,
      effectiveDate,
      municipalityName,
    } = req;

    if (
      !packageType ||
      valueCents === undefined ||
      !currency ||
      !effectiveDate
    ) {
      throw new BadRequestError(
        "Missing required fields: packageType, valueCents, currency, and effectiveDate are required"
      );
    }

    const price = await this.priceApplicationService.createPrice({
      packageType: packageType as PackageTypeValue,
      valueCents,
      currency,
      effectiveDate: new Date(effectiveDate),
      municipalityName,
    });

    return PriceMapper.toCreatePriceResponseDto(price);
  }
}
