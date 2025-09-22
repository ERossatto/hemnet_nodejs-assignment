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
    try {
      const { packageType, year, municipalityId } = req.query as any;

      if (!packageType || !year) {
        res.status(400).json({
          error:
            "Missing required query parameters: packageType and year are required",
        } as any);
        return;
      }

      const yearNum = parseInt(year as string, 10);
      if (isNaN(yearNum)) {
        res.status(400).json({
          error: "Year must be a valid number",
        } as any);
        return;
      }

      const municipalityIdObj = municipalityId
        ? new MunicipalityId(municipalityId as string)
        : undefined;

      const pricingPeriods = await this.priceApplicationService.getPriceHistory(
        {
          packageType: packageType as PackageTypeValue,
          year: yearNum,
          municipalityId: municipalityIdObj,
        }
      );

      const responseDto =
        PriceMapper.toGetPriceHistoryResponseDto(pricingPeriods);

      res.status(200).json(responseDto);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      } as any);
    }
  }

  public async getCurrentPrice(
    req: Request,
    res: Response<GetCurrentPriceResponseDto>
  ): Promise<void> {
    try {
      const { packageType, municipalityId } = req.query as any;

      if (!packageType) {
        res.status(400).json({
          error: "Missing required query parameter: packageType",
        } as any);
        return;
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
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      } as any);
    }
  }

  public async getAllPricesForPackageType(
    req: Request,
    res: Response<GetAllPricesForPackageTypeResponseDto>
  ): Promise<void> {
    try {
      const { packageType } = req.params;

      if (!packageType) {
        res.status(400).json({
          error: "Missing required parameter: packageType",
        } as any);
        return;
      }

      const prices =
        await this.priceApplicationService.getAllPricesForPackageType(
          packageType as PackageTypeValue
        );

      const responseDto =
        PriceMapper.toGetAllPricesForPackageTypeResponseDto(prices);

      res.status(200).json(responseDto);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      } as any);
    }
  }

  public async createPrice(
    req: Request<{}, CreatePriceResponseDto, CreatePriceRequestDto>,
    res: Response<CreatePriceResponseDto>
  ): Promise<void> {
    try {
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
        res.status(400).json({
          error:
            "Missing required fields: packageType, valueCents, currency, and effectiveDate are required",
        } as any);
        return;
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
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      } as any);
    }
  }
}
