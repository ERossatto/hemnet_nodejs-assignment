import {
  IMunicipalityDomainService,
  Municipality,
  MunicipalityName,
  MunicipalityCode,
  CountryName,
} from "../../../domain-layer";
import { UseCase } from "../contracts";

export type CreateMunicipalityInput = {
  name: string;
  code: string;
  country: string;
};

export class CreateMunicipalityUseCase
  implements UseCase<CreateMunicipalityInput, Municipality>
{
  constructor(
    private readonly municipalityDomainService: IMunicipalityDomainService
  ) {}

  async execute(input: CreateMunicipalityInput): Promise<Municipality> {
    const name = MunicipalityName.create(input.name);
    const code = MunicipalityCode.create(input.code);
    const country = CountryName.create(input.country);

    return await this.municipalityDomainService.createMunicipality({
      name,
      code,
      country,
    });
  }
}
