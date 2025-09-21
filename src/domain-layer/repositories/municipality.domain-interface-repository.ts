import { Municipality } from "../entities/municipality.entity";
import { MunicipalityId } from "../identifiers/municipality-id.identifier";
import { MunicipalityName } from "../value-objects/municipality-name.value-object";

export interface IMunicipalityRepository {
  findById(id: MunicipalityId): Promise<Municipality | null>;
  findByName(name: MunicipalityName): Promise<Municipality | null>;
  save(municipality: Municipality): Promise<void>;
}
