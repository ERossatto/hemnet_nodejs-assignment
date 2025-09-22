import { ValueObject } from "../ddd-definitions/value-object.ddd";

interface CountryNameProps {
  value: string;
}

export class CountryName extends ValueObject<CountryNameProps> {
  constructor(props: CountryNameProps) {
    super(props);
  }

  get value(): CountryNameProps["value"] {
    return this.props.value;
  }

  public static create(value: CountryNameProps["value"]): CountryName {
    const normalizedValue = value.trim();

    return new CountryName({
      value: normalizedValue,
    });
  }

  public isEqual(other: ValueObject<CountryNameProps>): boolean {
    const isSameClass = other instanceof CountryName;
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
      throw new Error("Country name cannot be empty");
    }

    const isTooShort = value.length < 2;
    if (isTooShort) {
      throw new Error("Country name must be at least 2 characters long");
    }
  }
}
