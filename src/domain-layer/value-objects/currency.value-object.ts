import { ValueObject } from "../ddd-definitions/value-object.ddd";

interface CurrencyProps {
  value: string;
}

export class Currency extends ValueObject<CurrencyProps> {
  constructor(props: CurrencyProps) {
    super(props);
  }

  get value(): CurrencyProps["value"] {
    return this.props.value;
  }

  public static create(value: CurrencyProps["value"]): Currency {
    const normalizedValue = value.trim().toUpperCase();

    return new Currency({
      value: normalizedValue,
    });
  }

  public isEqual(other: ValueObject<CurrencyProps>): boolean {
    const isSameClass = other instanceof Currency;
    if (!isSameClass) {
      return false;
    }

    const hasSameValue = this.value === other.value;

    return hasSameValue;
  }

  protected doValidate(): void {
    const { value } = this.props;

    const codeIsEmpty = !value || value.trim().length === 0;
    if (codeIsEmpty) {
      throw new Error("Currency code cannot be empty");
    }

    const iso4217Regex = /^[A-Z]{3}$/;
    const hasInvalidFormat = !iso4217Regex.test(value);
    if (hasInvalidFormat) {
      throw new Error(
        "Currency code must follow ISO 4217 format: exactly 3 uppercase letters (e.g., USD, EUR, GBP)"
      );
    }
  }
}
