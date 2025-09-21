import { IPriceRepository } from "../../../domain-layer/repositories/price.domain-interface-repository";
import { Price } from "../../../domain-layer/aggregates/price.aggregate";
import { PackageTypeValue } from "../../../domain-layer/value-objects/package-type.value-object";
import { Price as PriceModel } from "../models/price.sequelize-model";
import { Package as PackageModel } from "../models/package.sequelize-model";
import { Municipality as MunicipalityModel } from "../models/municipality.sequelize-model";
import { PriceMapper } from "../mappers/price.infrastructure-mapper";

export class PriceSequelizeRepository implements IPriceRepository {
  async findByPackageType(packageType: PackageTypeValue): Promise<Price[]> {
    const rows = await PriceModel.findAll({
      include: [
        { model: PackageModel, required: true, where: { type: packageType } },
        { model: MunicipalityModel, required: false },
      ],
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
      packageId: _price.package.id.value,
      municipalityId: _price.municipality ? _price.municipality.id.value : null,
      priceCents: _price.valueCents.value,
      currency: _price.currency.value,
      effectiveDate: _price.effectiveDate,
      createdAt: _price.createdAt,
      updatedAt: _price.updatedAt,
    };

    await PriceModel.upsert(values);
  }
}
