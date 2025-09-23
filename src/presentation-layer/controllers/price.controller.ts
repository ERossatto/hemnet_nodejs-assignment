import { Request, Response } from "express";
import { IPriceApplicationService } from "../../application-layer/services/price.application-service";
import { PackageTypeValue, MunicipalityId } from "../../domain-layer";
import {
  GetPriceHistoryResponseDto,
  GetCurrentPriceResponseDto,
  GetAllPricesForPackageTypeResponseDto,
  CreatePriceRequestDto,
  CreatePriceResponseDto,
} from "../types";
import { PriceMapper } from "../mappers";
import { BadRequestError } from "../errors/http-errors";

export interface IPriceController {
  getPriceHistory(
    req: Request,
    res: Response<GetPriceHistoryResponseDto>
  ): Promise<void>;
  getCurrentPrice(
    req: Request,
    res: Response<GetCurrentPriceResponseDto>
  ): Promise<void>;
  getAllPricesForPackageType(
    req: Request,
    res: Response<GetAllPricesForPackageTypeResponseDto>
  ): Promise<void>;
  createPrice(
    req: Request<{}, CreatePriceResponseDto, CreatePriceRequestDto>,
    res: Response<CreatePriceResponseDto>
  ): Promise<void>;
}

export class PriceController implements IPriceController {
  constructor(
    private readonly priceApplicationService: IPriceApplicationService
  ) {}

  public async getPriceHistory(
    req: Request,
    res: Response<GetPriceHistoryResponseDto>
  ): Promise<void> {
    const { packageType, year, municipalityId } = req.query as any;

    if (!packageType || !year) {
      throw new BadRequestError(
        "Missing required query parameters: packageType and year are required"
      );
    }

    const yearNum = parseInt(year as string, 10);
    if (isNaN(yearNum)) {
      throw new BadRequestError("Year must be a valid number");
    }

    const municipalityIdObj = municipalityId
      ? new MunicipalityId(municipalityId as string)
      : undefined;

    const pricingPeriods = await this.priceApplicationService.getPriceHistory({
      packageType: packageType as PackageTypeValue,
      year: yearNum,
      municipalityId: municipalityIdObj,
    });

    const responseDto =
      PriceMapper.toGetPriceHistoryResponseDto(pricingPeriods);

    res.status(200).json(responseDto);
  }

  public async getCurrentPrice(
    req: Request,
    res: Response<GetCurrentPriceResponseDto>
  ): Promise<void> {
    const { packageType, municipalityId } = req.query as any;

    if (!packageType) {
      throw new BadRequestError(
        "Missing required query parameter: packageType"
      );
    }

    const municipalityIdObj = municipalityId
      ? new MunicipalityId(municipalityId as string)
      : undefined;

    const price = await this.priceApplicationService.getCurrentPrice({
      packageType: packageType as PackageTypeValue,
      municipalityId: municipalityIdObj,
    });

    const responseDto = PriceMapper.toGetCurrentPriceResponseDto(price);

    res.status(200).json(responseDto);
  }

  public async getAllPricesForPackageType(
    req: Request,
    res: Response<GetAllPricesForPackageTypeResponseDto>
  ): Promise<void> {
    const { packageType } = req.params;

    if (!packageType) {
      throw new BadRequestError("Missing required parameter: packageType");
    }

    const prices =
      await this.priceApplicationService.getAllPricesForPackageType(
        packageType as PackageTypeValue
      );

    const responseDto =
      PriceMapper.toGetAllPricesForPackageTypeResponseDto(prices);

    res.status(200).json(responseDto);
  }

  public async createPrice(
    req: Request<{}, CreatePriceResponseDto, CreatePriceRequestDto>,
    res: Response<CreatePriceResponseDto>
  ): Promise<void> {
    const {
      packageType,
      valueCents,
      currency,
      effectiveDate,
      municipalityName,
    } = req.body;

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

    const responseDto = PriceMapper.toCreatePriceResponseDto(price);

    res.status(201).json(responseDto);
  }
}
