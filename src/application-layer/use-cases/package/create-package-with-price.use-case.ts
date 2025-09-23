import {
  IPackageDomainService,
  Price,
  PackageTypeValue,
  IPriceDomainService,
  ValueCents,
  Currency,
  MunicipalityName,
} from "../../../domain-layer";
import { UseCase } from "../contracts";

export type CreatePackageWithPriceInput = {
  packageType: PackageTypeValue;
  valueCents: number;
  currency: string;
  effectiveDate: Date;
  municipalityName?: string;
};

export class CreatePackageWithPriceUseCase
  implements UseCase<CreatePackageWithPriceInput, Price>
{
  constructor(
    private readonly packageDomainService: IPackageDomainService,
    private readonly priceDomainService: IPriceDomainService
  ) {}

  async execute(input: CreatePackageWithPriceInput): Promise<Price> {
    await this.packageDomainService.createPackageByType(input.packageType);

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
