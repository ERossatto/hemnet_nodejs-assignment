import { sequelizeConnection } from "../../infrastructure-layer/db-sqlite-sequelize/config";
import { Package } from "../../infrastructure-layer/db-sqlite-sequelize/models/package.sequelize-model";
import { Price } from "../../infrastructure-layer/db-sqlite-sequelize/models/price.sequelize-model";

export default {
  async getAll() {
    return await Package.findAll({
      include: [{ model: Price, as: "prices" }],
    });
  },
  async updatePackagePrice(pack: Package, newPriceCents: number) {
    try {
      const newPackage = await sequelizeConnection.transaction(async (t) => {
        await Price.create(
          {
            packageId: pack.id,
            priceCents: pack.priceCents,
          },
          { transaction: t }
        );

        pack.priceCents = newPriceCents;

        return pack.save({ transaction: t });
      });

      return newPackage;
    } catch (err: unknown) {
      throw new Error("Error handling the transaction");
    }
  },

  async priceFor(municipality: string) {
    const foundPackage = await Package.findOne({
      where: { name: municipality },
    });

    if (!foundPackage) {
      return null;
    }

    return foundPackage.priceCents;
  },
};
