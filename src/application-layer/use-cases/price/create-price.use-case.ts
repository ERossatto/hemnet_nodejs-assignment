import {
  IPriceDomainService,
  IMunicipalityRepository,
  PackageTypeValue,
  Price,
  ValueCents,
  Currency,
  MunicipalityName,
  MunicipalityId,
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
  constructor(
    private readonly priceDomainService: IPriceDomainService,
    private readonly municipalityRepository: IMunicipalityRepository
  ) {}

  async execute(input: CreatePriceInput): Promise<Price> {
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
