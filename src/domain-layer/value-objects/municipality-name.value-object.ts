import { ValueObject } from "../ddd-definitions/value-object.ddd";

interface MunicipalityNameProps {
  value: string;
}

export class MunicipalityName extends ValueObject<MunicipalityNameProps> {
  constructor(props: MunicipalityNameProps) {
    super(props);
  }

  get value(): MunicipalityNameProps["value"] {
    return this.props.value;
  }

  public static create(
    value: MunicipalityNameProps["value"]
  ): MunicipalityName {
    const normalizedValue = value.trim();

    return new MunicipalityName({
      value: normalizedValue,
    });
  }

  public isEqual(other: ValueObject<MunicipalityNameProps>): boolean {
    const isSameClass = other instanceof MunicipalityName;
    if (!isSameClass) {
      return false;
    }

    const hasSameValue = this.value === other.value;

    return hasSameValue;
  }

  protected doValidate(): void {
    const { value } = this.props;

    const isEmpty = !value || value.trim().length === 0;
    if (isEmpty) {
      throw new Error("Municipality name cannot be empty");
    }

    const isTooLong = value.length > 100;
    if (isTooLong) {
      throw new Error("Municipality name cannot exceed 100 characters");
    }
  }
}
