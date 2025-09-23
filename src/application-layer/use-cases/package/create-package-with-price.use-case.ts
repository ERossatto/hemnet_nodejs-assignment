import {
  IPackageDomainService,
  Price,
  PackageTypeValue,
  IPriceDomainService,
  IMunicipalityRepository,
  ValueCents,
  Currency,
  MunicipalityName,
  MunicipalityId,
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
    private readonly priceDomainService: IPriceDomainService,
    private readonly municipalityRepository: IMunicipalityRepository
  ) {}

  async execute(input: CreatePackageWithPriceInput): Promise<Price> {
    await this.packageDomainService.createPackageByType(input.packageType);

    const valueCents = ValueCents.create(input.valueCents);
    const currency = Currency.create(input.currency);
    const effectiveDate = new Date(input.effectiveDate);

    let municipalityId: MunicipalityId | undefined = undefined;
    if (input.municipalityName) {
      const name = MunicipalityName.create(input.municipalityName);
      const municipality = await this.municipalityRepository.findByName(name);
      if (!municipality) {
        throw new Error(
          `Municipality with name ${input.municipalityName} not found`
        );
      }
      municipalityId = municipality.id;
    }

    return await this.priceDomainService.createPriceForPackageType({
      packageType: input.packageType,
      valueCents,
      currency,
      effectiveDate,
      municipalityId,
    });
  }
}
