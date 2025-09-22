import { ValueObject } from "../ddd-definitions/value-object.ddd";

interface MunicipalityCodeProps {
  value: string;
}

export class MunicipalityCode extends ValueObject<MunicipalityCodeProps> {
  constructor(props: MunicipalityCodeProps) {
    super(props);
  }

  get value(): MunicipalityCodeProps["value"] {
    return this.props.value;
  }

  public static create(
    value: MunicipalityCodeProps["value"]
  ): MunicipalityCode {
    const normalizedValue = value.trim().toUpperCase();

    return new MunicipalityCode({
      value: normalizedValue,
    });
  }

  public isEqual(other: ValueObject<MunicipalityCodeProps>): boolean {
    const isSameClass = other instanceof MunicipalityCode;
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
      throw new Error("Municipality code cannot be empty");
    }

    const codeIsTooShort = value.length < 2;
    if (codeIsTooShort) {
      throw new Error("Municipality code must be at least 2 characters long");
    }

    const codeIsTooLong = value.length > 10;
    if (codeIsTooLong) {
      throw new Error("Municipality code cannot exceed 10 characters");
    }

    const codeRegexToAllowAlphanumericAndCommonSeparators = /^[A-Z0-9\-_]+$/;
    if (!codeRegexToAllowAlphanumericAndCommonSeparators.test(value)) {
      throw new Error(
        "Municipality code can only contain letters, numbers, hyphens, and underscores"
      );
    }
  }
}
