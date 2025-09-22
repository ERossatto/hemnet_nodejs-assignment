export interface AddPackagePriceRequestDto {
  packageType: string;
  valueCents: number;
  currency: string;
  effectiveDate: string;
  municipalityName?: string;
}

export interface AddPackagePriceResponseDto {
  price: {
    id: string;
    valueCents: number;
    currency: string;
    effectiveDate: string;
    packageType: string;
    municipalityId?: string;
  };
}

export interface CreatePackageRequestDto {
  packageType: string;
  valueCents: number;
  currency: string;
  effectiveDate: string;
  municipalityName?: string;
}

export interface CreatePackageResponseDto {
  price: {
    id: string;
    valueCents: number;
    currency: string;
    effectiveDate: string;
    packageType: string;
    municipalityId?: string;
  };
}
