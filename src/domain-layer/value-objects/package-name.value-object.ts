import { ValueObject } from "../ddd-definitions/value-object.ddd";

export const PACKAGE_TYPES = {
  Basic: "Basic",
  Plus: "Plus",
  Premium: "Premium",
} as const;

export type PackageTypeValue =
  (typeof PACKAGE_TYPES)[keyof typeof PACKAGE_TYPES];

interface PackageTypeProps {
  value: PackageTypeValue;
}

export class PackageType extends ValueObject<PackageTypeProps> {
  constructor(props: PackageTypeProps) {
    super(props);
  }

  get value(): PackageTypeProps["value"] {
    return this.props.value;
  }

  public static create(props: PackageTypeProps): PackageType {
    return new PackageType(props);
  }

  public isEqual(other: ValueObject<PackageTypeProps>): boolean {
    const isSameClass = other instanceof PackageType;
    if (!isSameClass) {
      return false;
    }

    const hasSameValue = this.value === other.value;

    return hasSameValue;
  }

  protected doValidate(): void {
    const { value } = this.props;

    const isValidPackageType = Object.values(PACKAGE_TYPES).includes(value);
    if (!isValidPackageType) {
      throw new Error(`Invalid package type: ${value}`);
    }
  }
}
