import { ValueObject } from "../ddd-definitions/value-object.ddd";
import { PackageType, PACKAGE_TYPES } from "./package-type.value-object";

export const STORAGE_SIZES_IN_GB = {
  BASIC: 5,
  PLUS: 50,
  PREMIUM: 500,
} as const;

export type StorageSizeInGbValue =
  (typeof STORAGE_SIZES_IN_GB)[keyof typeof STORAGE_SIZES_IN_GB];

interface PackageStorageCapacityProps {
  value: {
    storegeSize: StorageSizeInGbValue;
    packageType: PackageType;
  };
}

export class PackageStorageCapacity extends ValueObject<PackageStorageCapacityProps> {
  constructor(props: PackageStorageCapacityProps) {
    super(props);
  }

  get value(): PackageStorageCapacityProps["value"] {
    return this.props.value;
  }

  public static create(packageType: PackageType): PackageStorageCapacity {
    switch (packageType.value) {
      case PACKAGE_TYPES.Basic:
        return new PackageStorageCapacity({
          value: {
            storegeSize: STORAGE_SIZES_IN_GB.BASIC,
            packageType,
          },
        });
      case PACKAGE_TYPES.Plus:
        return new PackageStorageCapacity({
          value: {
            storegeSize: STORAGE_SIZES_IN_GB.PLUS,
            packageType,
          },
        });
      case PACKAGE_TYPES.Premium:
        return new PackageStorageCapacity({
          value: {
            storegeSize: STORAGE_SIZES_IN_GB.PREMIUM,
            packageType,
          },
        });
      default:
        throw new Error(`Unknown package type: ${packageType.value}`);
    }
  }

  public isEqual(other: ValueObject<PackageStorageCapacityProps>): boolean {
    const isSameClass = other instanceof PackageStorageCapacity;
    if (!isSameClass) {
      return false;
    }

    return this.value === other.value;
  }

  private _getExpectedSizeForPackageType(
    packageType: PackageType
  ): StorageSizeInGbValue {
    switch (packageType.value) {
      case PACKAGE_TYPES.Basic:
        return STORAGE_SIZES_IN_GB.BASIC;
      case PACKAGE_TYPES.Plus:
        return STORAGE_SIZES_IN_GB.PLUS;
      case PACKAGE_TYPES.Premium:
        return STORAGE_SIZES_IN_GB.PREMIUM;
      default:
        throw new Error(`Unknown package type: ${packageType.value}`);
    }
  }

  protected doValidate(): void {
    const {
      value: { storegeSize, packageType },
    } = this.props;

    // Basic validation for storage size
    if (storegeSize <= 0) {
      throw new Error("Storage size must be positive");
    }

    if (!Number.isInteger(storegeSize)) {
      throw new Error("Storage size must be an integer");
    }

    // Validate that the storage size matches the expected value for the package type
    const expectedSize = this._getExpectedSizeForPackageType(packageType);
    if (storegeSize !== expectedSize) {
      throw new Error(
        `Invalid storage size for package type ${packageType.value}. Expected: ${expectedSize}GB, got: ${storegeSize}GB`
      );
    }
  }
}
