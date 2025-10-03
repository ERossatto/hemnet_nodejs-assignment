import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelizeConnection } from "../config";
import { Municipality } from "./municipality.sequelize-model";
import { PACKAGE_TYPES } from "../../../domain-layer/value-objects/package-type.value-object";

class Price extends Model<
  InferAttributes<Price>,
  InferCreationAttributes<Price>
> {
  declare id: string;
  declare priceCents: number;
  declare packageType: string;
  declare municipalityId: CreationOptional<Municipality["id"] | null>;
  declare currency: string;
  declare effectiveDate: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Price.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    packageType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(PACKAGE_TYPES) as string[]],
      },
    },
    priceCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    municipalityId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    effectiveDate: {
      type: DataTypes.DATE,
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

export { Price };

Price.belongsTo(Municipality, { foreignKey: "municipalityId" });
