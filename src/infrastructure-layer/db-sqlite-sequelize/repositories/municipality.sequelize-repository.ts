import { IMunicipalityRepository } from "@domain/repositories/municipality.domain-interface-repository";
import { Municipality } from "@domain/entities/municipality.entity";
import { MunicipalityId } from "@domain/identifiers/municipality-id.identifier";
import { Municipality as MunicipalityModel } from "@infrastructure/db-sqlite-sequelize/models/municipality.sequelize-model";
import { MunicipalityMapper } from "@infrastructure/db-sqlite-sequelize/mappers/municipality.infrastructure-mapper";

export class MunicipalitySequelizeRepository
  implements IMunicipalityRepository
{
  async findById(id: MunicipalityId): Promise<Municipality | null> {
    const row = await MunicipalityModel.findByPk(id.value as any);
    return row ? MunicipalityMapper.toDomain(row) : null;
  }

  async save(entity: Municipality): Promise<void> {
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
