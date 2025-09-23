export interface GetPriceHistoryRequestDto {
  packageType: string;
  year: number;
  municipalityId?: string;
}

export interface PricingPeriodDto {
  id: string;
  valueCents: number;
  currency: string;
  effectiveDate: string;
  endDate?: string;
}

export interface GetPriceHistoryResponseDto {
  pricingPeriods: PricingPeriodDto[];
}

export interface GetCurrentPriceRequestDto {
  packageType: string;
  municipalityId?: string;
}

export interface PriceDto {
  id: string;
  valueCents: number;
  currency: string;
  effectiveDate: string;
  packageType: string;
  municipalityId?: string;
  municipalityName?: string;
}

export interface GetCurrentPriceResponseDto {
  price: PriceDto | null;
}

export interface GetAllPricesForPackageTypeRequestDto {
  packageType: string;
}

export interface GetAllPricesForPackageTypeResponseDto {
  prices: PriceDto[];
}

export interface CreatePriceRequestDto {
  packageType: string;
  valueCents: number;
  currency: string;
  effectiveDate: string;
  municipalityName?: string;
}

export interface CreatePriceResponseDto {
  price: PriceDto;
}
