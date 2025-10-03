import { AggregateRoot } from "../ddd-definitions/aggregate-root.ddd";
import { ValueCents } from "../value-objects/value-cents.value-object";
import { Currency } from "../value-objects/currency.value-object";
import { PriceId } from "../identifiers/price-id.identifier";
import { MunicipalityId } from "../identifiers/municipality-id.identifier";
import { PackageType } from "../value-objects/package-type.value-object";

interface PriceProps {
  id: PriceId;
  packageType: PackageType;
  valueCents: ValueCents;
  municipalityId?: MunicipalityId;
  currency: Currency;
  effectiveDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

type PricePropsToCreate = Omit<PriceProps, "id" | "createdAt" | "updatedAt">;

export class Price extends AggregateRoot<PriceProps> {
  constructor(props: PriceProps) {
    super(props);
  }

  get id(): PriceId {
    return this.props.id;
  }

  get packageType(): PriceProps["packageType"] {
    return this.props.packageType;
  }

  get valueCents(): ValueCents {
    return this.props.valueCents;
  }

  get currency(): Currency {
    return this.props.currency;
  }

  get effectiveDate(): Date {
    return new Date(this.props.effectiveDate);
  }

  get municipalityId(): MunicipalityId | undefined {
    return this.props.municipalityId;
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  public static create(props: PricePropsToCreate): Price {
    const now = new Date();

    return new Price({
      id: PriceId.create(),
      packageType: props.packageType,
      valueCents: props.valueCents,
      currency: props.currency,
      effectiveDate: new Date(props.effectiveDate),
      municipalityId: props.municipalityId,
      createdAt: now,
      updatedAt: now,
    });
  }

  public isApplicableToMunicipality(municipalityId: MunicipalityId): boolean {
    if (this.isStandardPricing()) {
      return true;
    }

    return this.props.municipalityId?.equals(municipalityId) ?? false;
  }

  public isStandardPricing(): boolean {
    return !this.props.municipalityId;
  }

  public hasSameValueCentsAs(other: Price): boolean {
    const sameCurrency = this.currency.isEqual(other.currency);
    const sameAmount = this.valueCents.isEqual(other.valueCents);
    return sameCurrency && sameAmount;
  }
}
