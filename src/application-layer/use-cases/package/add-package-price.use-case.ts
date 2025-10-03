import {
  IPackageRepository,
  PackageTypeValue,
  Price,
  IPriceDomainService,
  ValueCents,
  Currency,
  MunicipalityName,
  PackageType,
} from "../../../domain-layer";
import { UseCase } from "../contracts";

export type AddPackagePriceInput = {
  packageType: PackageTypeValue;
  valueCents: number;
  currency: string;
  effectiveDate: Date;
  municipalityName?: string;
};

export class AddPackagePriceUseCase
  implements UseCase<AddPackagePriceInput, Price>
{
  constructor(
    private readonly packageRepository: IPackageRepository,
    private readonly priceDomainService: IPriceDomainService
  ) {}

  async execute(input: AddPackagePriceInput): Promise<Price> {
    const packageEntity = await this.packageRepository.findByPackageType(
      input.packageType
    );

    if (!packageEntity) {
      throw new Error(`Package with type ${input.packageType} not found`);
    }

    const valueCents = ValueCents.create(input.valueCents);
    const currency = Currency.create(input.currency);
    const effectiveDate = new Date(input.effectiveDate);
    const packageType = PackageType.create(input.packageType);

    const municipalityName = input.municipalityName
      ? MunicipalityName.create(input.municipalityName)
      : undefined;

    return await this.priceDomainService.createPriceForPackageType({
      packageType,
      valueCents,
      currency,
      effectiveDate,
      municipalityName,
    });
  }
}
