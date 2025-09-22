import {
  IMunicipalityRepository,
  Municipality,
  MunicipalityName,
  MunicipalityCode,
  CountryName,
} from "../../domain-layer";

export interface IMunicipalityApplicationService {
  createMunicipality(props: {
    name: string;
    code: string;
    country: string;
  }): Promise<Municipality>;
  getMunicipalityByName(name: string): Promise<Municipality | null>;
}

export class MunicipalityApplicationService
  implements IMunicipalityApplicationService
{
  constructor(
    private readonly municipalityRepository: IMunicipalityRepository
  ) {}

  async createMunicipality(props: {
    name: string;
    code: string;
    country: string;
  }): Promise<Municipality> {
    const { name, code, country } = props;

    // Create value objects (domain layer responsibility)
    const municipalityName = MunicipalityName.create(name);
    const municipalityCode = MunicipalityCode.create(code);
    const countryName = CountryName.create(country);

    // Create municipality entity (domain layer responsibility)
    const municipality = Municipality.create({
      name: municipalityName,
      code: municipalityCode,
      country: countryName,
    });

    // Persist via repository (infrastructure layer)
    await this.municipalityRepository.save(municipality);

    return municipality;
  }

  async getMunicipalityByName(name: string): Promise<Municipality | null> {
    const municipalityName = MunicipalityName.create(name);
    return await this.municipalityRepository.findByName(municipalityName);
  }
}
