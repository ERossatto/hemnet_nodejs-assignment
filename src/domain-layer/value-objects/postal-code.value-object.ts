import { ValueObject } from "../ddd-definitions/value-object.ddd";

interface PostalCodeProps {
  value: string;
}

export class PostalCode extends ValueObject<PostalCodeProps> {
  constructor(props: PostalCodeProps) {
    super(props);
  }

  get value(): PostalCodeProps["value"] {
    return this.props.value;
  }

  public static create(props: PostalCodeProps): PostalCode {
    const normalizedValue = props.value.trim().toUpperCase().replace(/\s/g, "");

    return new PostalCode({
      value: normalizedValue,
    });
  }

  public isEqual(other: PostalCode): boolean {
    const isSameClass = other instanceof PostalCode;
    if (!isSameClass) {
      return false;
    }

    const hasSameValue = this.value === other.value;

    return hasSameValue;
  }

  protected doValidate(): void {
    const { value } = this.props;

    const postalCodeIsEmpty = !value || value.trim().length === 0;
    if (postalCodeIsEmpty) {
      throw new Error("Postal code cannot be empty");
    }

    // TODO: Extend this based on country-specific rules
    const postalCodeRegex = /^[A-Z0-9]{3,10}$/;
    if (!postalCodeRegex.test(value)) {
      throw new Error("Postal code must be 3-10 alphanumeric characters");
    }
  }
}
