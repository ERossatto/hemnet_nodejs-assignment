import {
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelizeConnection } from "../config";
import {
  type BackupFrequencyTypeValue,
  type PackageTypeValue,
  type StorageSizeInGbValue,
  BACKUP_FREQUENCY_TYPES,
  PACKAGE_TYPES,
  STORAGE_SIZES_IN_GB,
} from "../../../domain-layer/value-objects";

class Package extends Model<
  InferAttributes<Package>,
  InferCreationAttributes<Package>
> {
  declare id: string;
  declare type: PackageTypeValue;
  declare storageGb: StorageSizeInGbValue;
  declare backupFrequency: BackupFrequencyTypeValue;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Package.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(PACKAGE_TYPES) as string[]],
      },
    },
    storageGb: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [Object.values(STORAGE_SIZES_IN_GB) as number[]],
      },
    },
    backupFrequency: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(BACKUP_FREQUENCY_TYPES) as string[]],
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize: sequelizeConnection }
);

export { Package };
