import { Municipality as MunicipalityModel } from "../models/municipality.sequelize-model";
import { Municipality } from "../../../domain-layer/entities/municipality.entity";
import { MunicipalityId } from "../../../domain-layer/identifiers/municipality-id.identifier";
import { MunicipalityName } from "../../../domain-layer/value-objects/municipality-name.value-object";
import { MunicipalityCode } from "../../../domain-layer/value-objects/municipality-code.value-object";
import { CountryName } from "../../../domain-layer/value-objects/country-name.value-object";

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
