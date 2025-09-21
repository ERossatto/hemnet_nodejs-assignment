import { Municipality } from "../entities/municipality.entity";
import { MunicipalityId } from "../identifiers/municipality-id.identifier";

export interface IMunicipalityRepository {
  findById(id: MunicipalityId): Promise<Municipality | null>;
  save(municipality: Municipality): Promise<void>;
}
