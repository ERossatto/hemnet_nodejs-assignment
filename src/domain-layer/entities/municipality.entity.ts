import { Entity } from "../ddd-definitions/entity.ddd";
import { MunicipalityId } from "../identifiers/municipality-id.identifier";
import { MunicipalityName } from "../value-objects/municipality-name.value-object";
import { MunicipalityCode } from "../value-objects/municipality-code.value-object";
import { CountryName } from "../value-objects/country-name.value-object";

interface MunicipalityProps {
  id: MunicipalityId;
  name: MunicipalityName;
  code: MunicipalityCode;
  country: CountryName;
  createdAt: Date;
  updatedAt: Date;
}

type MunicipalityPropsToCreate = Omit<
  MunicipalityProps,
  "id" | "createdAt" | "updatedAt"
>;

export class Municipality extends Entity<MunicipalityProps> {
  constructor(props: MunicipalityProps) {
    super(props);
  }

  get id(): MunicipalityId {
    return this.props.id;
  }

  get name(): MunicipalityName {
    return this.props.name;
  }

  get code(): MunicipalityCode {
    return this.props.code;
  }

  get country(): CountryName {
    return this.props.country;
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  get municipalityId(): MunicipalityId {
    return this.id;
  }

  public static create(props: MunicipalityPropsToCreate): Municipality {
    const now = new Date();

    return new Municipality({
      id: new MunicipalityId(),
      name: props.name,
      code: props.code,
      country: props.country,
      createdAt: now,
      updatedAt: now,
    });
  }

  public updateName(newName: MunicipalityName): void {
    if (this.props.name.isEqual(newName)) {
      return;
    }

    this.props.name = newName;
    this.props.updatedAt = new Date();
  }

  public updateCode(newCode: MunicipalityCode): void {
    if (this.props.code.isEqual(newCode)) {
      return;
    }

    this.props.code = newCode;
    this.props.updatedAt = new Date();
  }

  public updateCountry(newCountry: CountryName): void {
    if (this.props.country.isEqual(newCountry)) {
      return;
    }

    this.props.country = newCountry;
    this.props.updatedAt = new Date();
  }
}
