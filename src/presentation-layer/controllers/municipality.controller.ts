import { IMunicipalityApplicationService } from "../../application-layer/services/municipality.application-service";
import {
  CreateMunicipalityRequestDto,
  CreateMunicipalityResponseDto,
  GetMunicipalityByNameResponseDto,
} from "../types";
import { MunicipalityMapper } from "../mappers";
import { BadRequestError, NotFoundError } from "../errors/http-errors";

export interface IMunicipalityController {
  createMunicipality(
    req: CreateMunicipalityRequestDto
  ): Promise<CreateMunicipalityResponseDto>;
  getMunicipalityByName(req: {
    name: string;
  }): Promise<GetMunicipalityByNameResponseDto>;
}

export class MunicipalityController implements IMunicipalityController {
  constructor(
    private readonly municipalityApplicationService: IMunicipalityApplicationService
  ) {}

  public async createMunicipality(
    req: CreateMunicipalityRequestDto
  ): Promise<CreateMunicipalityResponseDto> {
    const { name, code, country } = req;

    if (!name || !code || !country) {
      throw new BadRequestError(
        "Missing required fields: name, code, and country are required"
      );
    }

    const municipality =
      await this.municipalityApplicationService.createMunicipality({
        name,
        code,
        country,
      });

    return MunicipalityMapper.toCreateResponseDto(municipality);
  }

  public async getMunicipalityByName(req: {
    name: string;
  }): Promise<GetMunicipalityByNameResponseDto> {
    const { name } = req;

    if (!name) {
      throw new BadRequestError("Municipality name is required");
    }

    const municipality =
      await this.municipalityApplicationService.getMunicipalityByName(name);

    if (!municipality) {
      throw new NotFoundError(`Municipality with name '${name}' not found`);
    }

    return MunicipalityMapper.toGetByNameResponseDto(municipality);
  }
}
