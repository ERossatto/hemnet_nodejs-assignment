import {
  IMunicipalityDomainService,
  Municipality,
} from "../../../domain-layer";
import { UseCase } from "../contracts";

export class GetMunicipalityByNameUseCase
  implements UseCase<string, Municipality | null>
{
  constructor(
    private readonly municipalityDomainService: IMunicipalityDomainService
  ) {}

  async execute(name: string): Promise<Municipality | null> {
    return await this.municipalityDomainService.getMunicipalityByName(name);
  }
}
