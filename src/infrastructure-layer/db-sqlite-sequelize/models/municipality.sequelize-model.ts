import {
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelizeConnection } from "@infrastructure/db-sqlite-sequelize/config";

class Municipality extends Model<
  InferAttributes<Municipality>,
  InferCreationAttributes<Municipality>
> {
  declare id: string;
  declare name: string;
  declare code: string;
  declare country: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Municipality.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
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

export { Municipality };
