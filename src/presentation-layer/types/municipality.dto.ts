export interface CreateMunicipalityRequestDto {
  name: string;
  code: string;
  country: string;
}

export interface CreateMunicipalityResponseDto {
  id: string;
  name: string;
  code: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetMunicipalityByNameRequestDto {
  name: string;
}

export interface GetMunicipalityByNameResponseDto {
  id: string;
  name: string;
  code: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}
