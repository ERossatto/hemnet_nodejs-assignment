import {
  type CreationOptional,
  DataTypes,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelizeConnection } from "../config";
import { Package } from "./package.sequelize-model";
import { Municipality } from "./municipality.sequelize-model";

class Price extends Model<
  InferAttributes<Price>,
  InferCreationAttributes<Price>
> {
  declare id: string;
  declare priceCents: number;
  declare packageId: ForeignKey<Package["id"]>;
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
    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
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

Price.belongsTo(Package, { foreignKey: "packageId" });
Price.belongsTo(Municipality, { foreignKey: "municipalityId" });
