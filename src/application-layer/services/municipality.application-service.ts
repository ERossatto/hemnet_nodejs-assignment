import {
  CountryName,
  Municipality,
  MunicipalityCode,
  MunicipalityName,
} from "../../domain-layer";
import { IMunicipalityDomainService } from "../../domain-layer/services/municipality.domain-service";

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
    private readonly municipalityDomainService: IMunicipalityDomainService
  ) {}

  async createMunicipality(props: {
    name: string;
    code: string;
    country: string;
  }): Promise<Municipality> {
    const { name, code, country } = props;

    const municipalityName = MunicipalityName.create(name);
    const municipalityCode = MunicipalityCode.create(code);
    const countryName = CountryName.create(country);

    return await this.municipalityDomainService.createMunicipality({
      name: municipalityName,
      code: municipalityCode,
      country: countryName,
    });
  }

  async getMunicipalityByName(name: string): Promise<Municipality | null> {
    return await this.municipalityDomainService.getMunicipalityByName(name);
  }
}
