import { IPriceRepository } from "../../../domain-layer/repositories/price.domain-interface-repository";
import { Price } from "../../../domain-layer/aggregates/price.aggregate";
import { PackageTypeValue } from "../../../domain-layer/value-objects/package-type.value-object";
import { Price as PriceModel } from "../models/price.sequelize-model";
import { Municipality as MunicipalityModel } from "../models/municipality.sequelize-model";
import { PriceMapper } from "../mappers/price.infrastructure-mapper";
import { withOrmErrorTranslation } from "../utils/error-translation";

export class PriceSequelizeRepository implements IPriceRepository {
  async findManyByPackageType(packageType: PackageTypeValue): Promise<Price[]> {
    const rows = await PriceModel.findAll({
      where: { packageType },
      include: [{ model: MunicipalityModel, required: false }],
      order: [
        ["effectiveDate", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    return rows.map((row) => PriceMapper.toDomainSafe(row));
  }

  async save(_price: Price): Promise<void> {
    const values = {
      id: _price.id.value,
      packageType: _price.packageType.value,
      municipalityId: _price.municipalityId
        ? _price.municipalityId.value
        : null,
      priceCents: _price.valueCents.value,
      currency: _price.currency.value,
      effectiveDate: _price.effectiveDate,
      createdAt: _price.createdAt,
      updatedAt: _price.updatedAt,
    };

    await withOrmErrorTranslation(async () => PriceModel.upsert(values));
  }
}
