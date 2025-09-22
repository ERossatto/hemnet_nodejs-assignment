import { Request, Response } from "express";
import { IPackageApplicationService } from "../../application-layer/services/package.application-service";
import { PackageTypeValue } from "../../domain-layer";
import {
  AddPackagePriceRequestDto,
  AddPackagePriceResponseDto,
  CreatePackageRequestDto,
  CreatePackageResponseDto,
} from "../types";
import { PackageMapper } from "../mappers";

export interface IPackageController {
  addPackagePrice(
    req: Request<{}, AddPackagePriceResponseDto, AddPackagePriceRequestDto>,
    res: Response<AddPackagePriceResponseDto>
  ): Promise<void>;
  createPackage(
    req: Request<{}, CreatePackageResponseDto, CreatePackageRequestDto>,
    res: Response<CreatePackageResponseDto>
  ): Promise<void>;
}

export class PackageController implements IPackageController {
  constructor(
    private readonly packageApplicationService: IPackageApplicationService
  ) {}

  public async addPackagePrice(
    req: Request<{}, AddPackagePriceResponseDto, AddPackagePriceRequestDto>,
    res: Response<AddPackagePriceResponseDto>
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

      const price = await this.packageApplicationService.addPackagePrice({
        packageType: packageType as PackageTypeValue,
        valueCents,
        currency,
        effectiveDate: new Date(effectiveDate),
        municipalityName,
      });

      const responseDto = PackageMapper.toAddPackagePriceResponseDto(price);

      res.status(201).json(responseDto);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      } as any);
    }
  }

  public async createPackage(
    req: Request<{}, CreatePackageResponseDto, CreatePackageRequestDto>,
    res: Response<CreatePackageResponseDto>
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

      const price = await this.packageApplicationService.createPackage({
        packageType: packageType as PackageTypeValue,
        valueCents,
        currency,
        effectiveDate: new Date(effectiveDate),
        municipalityName,
      });

      const responseDto = PackageMapper.toCreatePackageResponseDto(price);

      res.status(201).json(responseDto);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      } as any);
    }
  }
}
