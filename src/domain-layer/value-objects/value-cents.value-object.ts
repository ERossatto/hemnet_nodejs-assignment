import { ValueObject } from "../ddd-definitions/value-object.ddd";

interface ValueCentsProps {
  value: number;
}

export class ValueCents extends ValueObject<ValueCentsProps> {
  constructor(props: ValueCentsProps) {
    super(props);
  }

  get value(): ValueCentsProps["value"] {
    return this.props.value;
  }

  public static create(value: ValueCentsProps["value"]): ValueCents {
    return new ValueCents({ value });
  }

  public isEqual(other: ValueObject<ValueCentsProps>): boolean {
    const isSameClass = other instanceof ValueCents;
    if (!isSameClass) {
      return false;
    }

    const hasSameValue = this.value === other.value;

    return hasSameValue;
  }

  protected doValidate(): void {
    const { value } = this.props;

    const valueIsNegative = value < 0;
    if (valueIsNegative) {
      throw new Error("Value in cents cannot be negative");
    }

    const valueIsNotInteger = !Number.isInteger(value);
    if (valueIsNotInteger) {
      throw new Error("Value in cents must be an integer");
    }

    const valueIsNotFinite = !Number.isFinite(value);
    if (valueIsNotFinite) {
      throw new Error("Value in cents must be a finite number");
    }
  }
}
