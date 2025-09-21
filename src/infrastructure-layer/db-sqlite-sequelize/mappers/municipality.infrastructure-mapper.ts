import { Municipality as MunicipalityModel } from "@infrastructure/db-sqlite-sequelize/models/municipality.sequelize-model";
import { Municipality } from "@domain/entities/municipality.entity";
import { MunicipalityId } from "@domain/identifiers/municipality-id.identifier";
import { MunicipalityName } from "@domain/value-objects/municipality-name.value-object";
import { MunicipalityCode } from "@domain/value-objects/municipality-code.value-object";
import { CountryName } from "@domain/value-objects/country-name.value-object";

export class MunicipalityMapper {
  static toDomain(row: MunicipalityModel): Municipality {
    return new Municipality({
      id: new MunicipalityId(row.id),
      name: MunicipalityName.create(row.name),
      code: MunicipalityCode.create(row.code),
      country: CountryName.create(row.country),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
