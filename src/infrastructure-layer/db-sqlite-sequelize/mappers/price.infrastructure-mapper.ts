import { Price as PriceModel } from "@infrastructure/db-sqlite-sequelize/models/price.sequelize-model";
import { Package as PackageModel } from "@infrastructure/db-sqlite-sequelize/models/package.sequelize-model";
import { Municipality as MunicipalityModel } from "@infrastructure/db-sqlite-sequelize/models/municipality.sequelize-model";
import { Price } from "@domain/aggregates/price.aggregate";
import { PriceId } from "@domain/identifiers/price-id.identifier";
import { ValueCents, Currency } from "@domain/value-objects";
import { PackageMapper } from "./package.infrastructure-mapper";
import { MunicipalityMapper } from "./municipality.infrastructure-mapper";

export type PriceMapperRow = PriceModel & {
  Package: PackageModel;
  Municipality?: MunicipalityModel;
};

export class PriceMapper {
  static _isValidRow(row: any): row is PriceMapperRow {
    return (
      row &&
      typeof row.id === "string" &&
      typeof row.priceCents === "number" &&
      row.Package &&
      typeof row.Package.id === "string"
    );
  }

  static toDomain(row: PriceMapperRow): Price {
    if (!this._isValidRow(row)) {
      throw new Error("Invalid price row structure");
    }

    const pkg = PackageMapper.toDomain(row.Package);

    const municipality = row.Municipality
      ? MunicipalityMapper.toDomain(row.Municipality)
      : undefined;

    return new Price({
      id: new PriceId(row.id),
      package: pkg,
      valueCents: ValueCents.create(row.priceCents),
      currency: Currency.create(row.currency),
      effectiveDate: row.effectiveDate,
      municipality,
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
