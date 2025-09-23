import {
  IPackageRepository,
  IPackageDomainService,
  Price,
} from "../../domain-layer";
import {
  IPriceApplicationService,
  PriceCreationProps,
} from "./price.application-service";

export interface IPackageApplicationService {
  addPackagePrice(props: PriceCreationProps): Promise<Price>;
  createPackageWithPrice(props: PriceCreationProps): Promise<Price>;
}

export class PackageApplicationService implements IPackageApplicationService {
  constructor(
    private readonly packageRepository: IPackageRepository,
    private readonly packageDomainService: IPackageDomainService,
    private readonly priceApplicationService: IPriceApplicationService
  ) {}

  async addPackagePrice(props: PriceCreationProps): Promise<Price> {
    const packageEntity = await this.packageRepository.findByPackageType(
      props.packageType
    );

    if (!packageEntity) {
      throw new Error(`Package with type ${props.packageType} not found`);
    }

    const newPrice = await this.priceApplicationService.createPrice({
      ...props,
    });

    return newPrice;
  }

  async createPackageWithPrice(props: PriceCreationProps): Promise<Price> {
    await this.packageDomainService.createPackageByType(props.packageType);

    const newPrice = await this.priceApplicationService.createPrice({
      ...props,
    });

    return newPrice;
  }
}
