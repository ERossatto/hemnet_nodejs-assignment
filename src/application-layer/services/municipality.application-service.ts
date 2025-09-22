import {
  IMunicipalityRepository,
  Municipality,
  MunicipalityName,
} from "../../domain-layer";

export interface IMunicipalityApplicationService {
  getMunicipalityByName(name: string): Promise<Municipality | null>;
}

export class MunicipalityApplicationService
  implements IMunicipalityApplicationService
{
  constructor(
    private readonly municipalityRepository: IMunicipalityRepository
  ) {}

  async getMunicipalityByName(name: string): Promise<Municipality | null> {
    const municipalityName = MunicipalityName.create(name);
    return await this.municipalityRepository.findByName(municipalityName);
  }
}
