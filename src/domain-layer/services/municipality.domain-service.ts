import { Municipality } from "../entities";
import { IMunicipalityRepository } from "../repositories";
import {
  CountryName,
  MunicipalityCode,
  MunicipalityName,
} from "../value-objects";

export interface IMunicipalityDomainService {
  createMunicipality(props: {
    name: MunicipalityName;
    code: MunicipalityCode;
    country: CountryName;
  }): Promise<Municipality>;
  getMunicipalityByName(name: string): Promise<Municipality | null>;
}

export class MunicipalityDomainService implements IMunicipalityDomainService {
  constructor(
    private readonly municipalityRepository: IMunicipalityRepository
  ) {}

  async createMunicipality(props: {
    name: MunicipalityName;
    code: MunicipalityCode;
    country: CountryName;
  }): Promise<Municipality> {
    const { name, code, country } = props;

    const municipality = Municipality.create({
      name,
      code,
      country,
    });

    await this.municipalityRepository.save(municipality);

    return municipality;
  }

  async getMunicipalityByName(name: string): Promise<Municipality | null> {
    const municipalityName = MunicipalityName.create(name);
    return await this.municipalityRepository.findByName(municipalityName);
  }
}
