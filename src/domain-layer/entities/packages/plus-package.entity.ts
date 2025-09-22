import { PackageId } from "../../identifiers/package-id.identifier";
import {
  PackageType,
  PACKAGE_TYPES,
} from "../../value-objects/package-type.value-object";
import { PackageStorageCapacity } from "../../value-objects/package-storage-capacity.value-object";
import { PackageBackupFrequency } from "../../value-objects/package-backup-frequency.value-object";
import {
  AbstractPackage,
  AbstractPackageProps,
} from "./_abstract-package.entity";

export class PlusPackage extends AbstractPackage {
  constructor(props: AbstractPackageProps) {
    super(props);
  }

  public static create(): PlusPackage {
    const now = new Date();
    const packageId = new PackageId();
    const type = PackageType.create(PACKAGE_TYPES.Plus);
    const storage = PackageStorageCapacity.create(type);
    const backup = PackageBackupFrequency.create(type);

    const props: AbstractPackageProps = {
      id: packageId,
      type,
      storage,
      backup,
      createdAt: now,
      updatedAt: now,
    };

    return new PlusPackage(props);
  }
}
