import { AggregateRoot } from "../ddd-definitions/aggregate-root.ddd";
import { ValueCents } from "../value-objects/value-cents.value-object";
import { Currency } from "../value-objects/currency.value-object";
import { PriceId } from "../identifiers/price-id.identifier";
import { Municipality } from "../entities/municipality.entity";
import { MunicipalityId } from "../identifiers/municipality-id.identifier";
import { BasicPackage, PlusPackage, PremiumPackage } from "..";

interface PriceProps {
  id: PriceId;
  package: BasicPackage | PlusPackage | PremiumPackage;
  valueCents: ValueCents;
  municipality?: Municipality;
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

  get package(): PriceProps["package"] {
    return this.props.package;
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

  get municipality(): Municipality | undefined {
    return this.props.municipality;
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
      id: new PriceId(),
      package: props.package,
      valueCents: props.valueCents,
      currency: props.currency,
      effectiveDate: new Date(props.effectiveDate),
      municipality: props.municipality,
      createdAt: now,
      updatedAt: now,
    });
  }

  public isApplicableToMunicipality(municipalityId: MunicipalityId): boolean {
    if (this.isStandardPricing()) {
      return true;
    }

    return this.props.municipality!.id.equals(municipalityId);
  }

  public isStandardPricing(): boolean {
    return !this.props.municipality;
  }

  public hasSameValueCentsAs(other: Price): boolean {
    const sameCurrency = this.currency.isEqual(other.currency);
    const sameAmount = this.valueCents.isEqual(other.valueCents);
    return sameCurrency && sameAmount;
  }
}
