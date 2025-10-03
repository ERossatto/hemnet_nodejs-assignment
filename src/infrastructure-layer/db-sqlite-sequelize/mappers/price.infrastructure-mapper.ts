import { Price as PriceModel } from "../models/price.sequelize-model";
import { Municipality as MunicipalityModel } from "../models/municipality.sequelize-model";
import { Price } from "../../../domain-layer/aggregates/price.aggregate";
import { PriceId } from "../../../domain-layer/identifiers/price-id.identifier";
import {
  ValueCents,
  Currency,
  PackageType,
} from "../../../domain-layer/value-objects";
import { MunicipalityMapper } from "./municipality.infrastructure-mapper";

export type PriceMapperRow = PriceModel & {
  Municipality?: MunicipalityModel;
};

export class PriceMapper {
  static _isValidRow(row: any): row is PriceMapperRow {
    return (
      row &&
      typeof row.id === "string" &&
      typeof row.priceCents === "number" &&
      typeof row.packageType === "string"
    );
  }

  static toDomain(row: PriceMapperRow): Price {
    if (!this._isValidRow(row)) {
      throw new Error("Invalid price row structure");
    }

    const municipality = row.Municipality
      ? MunicipalityMapper.toDomain(row.Municipality)
      : undefined;

    return new Price({
      id: new PriceId(row.id),
      packageType: PackageType.create(row.packageType as any),
      valueCents: ValueCents.create(row.priceCents),
      currency: Currency.create(row.currency),
      effectiveDate: row.effectiveDate,
      municipalityId: municipality?.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toDomainSafe(row: unknown): Price {
    if (!this._isValidRow(row)) {
      throw new Error("Invalid price row structure");
    }

    return this.toDomain(row);
  }
}
