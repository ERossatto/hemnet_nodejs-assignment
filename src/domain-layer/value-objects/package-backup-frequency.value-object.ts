import { ValueObject } from "../ddd-definitions/value-object.ddd";
import { PackageType, PACKAGE_TYPES } from "./package-type.value-object";

export const BACKUP_FREQUENCY_TYPES = {
  NONE: "N/A",
  ONCE_PER_WEEK: "oncePerWeek",
  ON_EVERY_UPDATE: "onEveryUpdate",
} as const;

export type BackupFrequencyTypeValue =
  (typeof BACKUP_FREQUENCY_TYPES)[keyof typeof BACKUP_FREQUENCY_TYPES];

interface PackageBackupFrequencyProps {
  value: {
    backupFrequency: BackupFrequencyTypeValue;
    packageType: PackageType;
  };
}

export class PackageBackupFrequency extends ValueObject<PackageBackupFrequencyProps> {
  constructor(props: PackageBackupFrequencyProps) {
    super(props);
  }

  get value(): PackageBackupFrequencyProps["value"] {
    return this.props.value;
  }

  public static create(packageType: PackageType): PackageBackupFrequency {
    switch (packageType.value) {
      case PACKAGE_TYPES.Basic:
        return new PackageBackupFrequency({
          value: {
            backupFrequency: BACKUP_FREQUENCY_TYPES.NONE,
            packageType,
          },
        });
      case PACKAGE_TYPES.Plus:
        return new PackageBackupFrequency({
          value: {
            backupFrequency: BACKUP_FREQUENCY_TYPES.ONCE_PER_WEEK,
            packageType,
          },
        });
      case PACKAGE_TYPES.Premium:
        return new PackageBackupFrequency({
          value: {
            backupFrequency: BACKUP_FREQUENCY_TYPES.ON_EVERY_UPDATE,
            packageType,
          },
        });
      default:
        throw new Error(`Unknown package type: ${packageType.value}`);
    }
  }

  public isEqual(other: ValueObject<PackageBackupFrequencyProps>): boolean {
    const isSameClass = other instanceof PackageBackupFrequency;
    if (!isSameClass) {
      return false;
    }

    return this.value === other.value;
  }

  private _getExpectedFrequencyForPackageType(
    packageType: PackageType
  ): BackupFrequencyTypeValue {
    switch (packageType.value) {
      case PACKAGE_TYPES.Basic:
        return BACKUP_FREQUENCY_TYPES.NONE;
      case PACKAGE_TYPES.Plus:
        return BACKUP_FREQUENCY_TYPES.ONCE_PER_WEEK;
      case PACKAGE_TYPES.Premium:
        return BACKUP_FREQUENCY_TYPES.ON_EVERY_UPDATE;
      default:
        throw new Error(`Unknown package type: ${packageType.value}`);
    }
  }

  protected doValidate(): void {
    const {
      value: { backupFrequency, packageType },
    } = this.props;

    // Validate that the backup frequency type is valid
    const isValidBackupType = Object.values(BACKUP_FREQUENCY_TYPES).includes(
      backupFrequency
    );
    if (!isValidBackupType) {
      throw new Error(`Invalid backup frequency: ${backupFrequency}`);
    }

    // Validate that the backup frequency matches the expected value for the package type
    const expectedFrequency =
      this._getExpectedFrequencyForPackageType(packageType);
    if (backupFrequency !== expectedFrequency) {
      throw new Error(
        `Invalid backup frequency for package type ${packageType.value}. Expected: ${expectedFrequency}, got: ${backupFrequency}`
      );
    }
  }
}
