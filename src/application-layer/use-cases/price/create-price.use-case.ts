import {
  IPriceDomainService,
  PackageTypeValue,
  Price,
  ValueCents,
  Currency,
  MunicipalityName,
} from "../../../domain-layer";
import { UseCase } from "../contracts";

export type CreatePriceInput = {
  packageType: PackageTypeValue;
  valueCents: number;
  currency: string;
  effectiveDate: Date;
  municipalityName?: string;
};

export class CreatePriceUseCase implements UseCase<CreatePriceInput, Price> {
  constructor(private readonly priceDomainService: IPriceDomainService) {}

  async execute(input: CreatePriceInput): Promise<Price> {
    const valueCents = ValueCents.create(input.valueCents);
    const currency = Currency.create(input.currency);
    const effectiveDate = new Date(input.effectiveDate);

    const municipalityName = input.municipalityName
      ? MunicipalityName.create(input.municipalityName)
      : undefined;

    return await this.priceDomainService.createPriceForPackageType({
      packageType: input.packageType,
      valueCents,
      currency,
      effectiveDate,
      municipalityName,
    });
  }
}
