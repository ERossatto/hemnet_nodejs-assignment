import { IMunicipalityRepository } from "../../../domain-layer/repositories/municipality.domain-interface-repository";
import { Municipality } from "../../../domain-layer/entities/municipality.entity";
import { MunicipalityId } from "../../../domain-layer/identifiers/municipality-id.identifier";
import { MunicipalityName } from "../../../domain-layer/value-objects/municipality-name.value-object";
import { Municipality as MunicipalityModel } from "../models/municipality.sequelize-model";
import { MunicipalityMapper } from "../mappers/municipality.infrastructure-mapper";

export class MunicipalitySequelizeRepository
  implements IMunicipalityRepository
{
  async findById(id: MunicipalityId): Promise<Municipality | null> {
    const row = await MunicipalityModel.findByPk(id.value as any);
    return row ? MunicipalityMapper.toDomain(row) : null;
  }

  async findByName(name: MunicipalityName): Promise<Municipality | null> {
    const row = await MunicipalityModel.findOne({
      where: { name: name.value },
    });
    return row ? MunicipalityMapper.toDomain(row) : null;
  }

  async save(entity: Municipality): Promise<void> {
    // TODO: what if is there already a municipality with the same name?
    await MunicipalityModel.upsert({
      id: entity.id.value,
      name: entity.name.value,
      code: entity.code.value,
      country: entity.country.value,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
