import {
  IMunicipalityRepository,
  Municipality,
  MunicipalityName,
} from "../../domain-layer";

export class MunicipalityService {
  constructor(
    private readonly municipalityRepository: IMunicipalityRepository
  ) {}

  async getMunicipalityByName(name: string): Promise<Municipality | null> {
    const municipalityName = MunicipalityName.create(name);
    return await this.municipalityRepository.findByName(municipalityName);
  }
}
