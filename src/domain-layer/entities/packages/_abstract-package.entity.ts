import { Entity } from "../../ddd-definitions/entity.ddd";
import { PackageId } from "../../identifiers/package-id.identifier";
import { PackageType } from "../../value-objects/package-type.value-object";
import { PackageStorageCapacity } from "../../value-objects/package-storage-capacity.value-object";
import { PackageBackupFrequency } from "../../value-objects/package-backup-frequency.value-object";

export interface AbstractPackageProps {
  id: PackageId;
  type: PackageType;
  storage: PackageStorageCapacity;
  backup: PackageBackupFrequency;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class AbstractPackage extends Entity<AbstractPackageProps> {
  constructor(props: AbstractPackageProps) {
    super(props);
  }

  get id(): PackageId {
    return this.props.id;
  }

  get type(): PackageType {
    return this.props.type;
  }

  get storage(): PackageStorageCapacity {
    return this.props.storage;
  }

  get backup(): PackageBackupFrequency {
    return this.props.backup;
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }
}
