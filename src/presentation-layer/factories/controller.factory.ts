/**
 * Controller Factory - Demonstrates proper dependency injection setup
 *
 * In a real application, I would use a proper DI container like:
 * - inversify
 *
 * This factory shows how controllers should be instantiated with their dependencies
 */

import { MunicipalityController } from "../controllers/municipality.controller";
import { PriceController } from "../controllers/price.controller";
import { PackageController } from "../controllers/package.controller";

import { MunicipalityApplicationService } from "../../application-layer/services/municipality.application-service";
import { PriceApplicationService } from "../../application-layer/services/price.application-service";
import { PackageApplicationService } from "../../application-layer/services/package.application-service";

import { PriceDomainService } from "../../domain-layer/services/price.domain-service";
import { PriceHistoryDomainService } from "../../domain-layer/services/price-history.domain-service";
import { PackageDomainService } from "../../domain-layer/services/package.domain-service";

import { MunicipalitySequelizeRepository } from "../../infrastructure-layer/db-sqlite-sequelize/repositories/municipality.sequelize-repository";
import { PriceSequelizeRepository } from "../../infrastructure-layer/db-sqlite-sequelize/repositories/price.sequelize-repository";
import { PackageSequelizeRepository } from "../../infrastructure-layer/db-sqlite-sequelize/repositories/package.sequelize-repository";
import { MunicipalityDomainService } from "../../domain-layer/services/municipality.domain-service";

/**
 * Factory class to create controllers with proper dependency injection
 */
export class ControllerFactory {
  private static municipalityController: MunicipalityController;
  private static priceController: PriceController;
  private static packageController: PackageController;

  /**
   * Creates and returns a MunicipalityController instance
   * In a real app, this would be handled by a DI container
   */
  public static createMunicipalityController(): MunicipalityController {
    if (!this.municipalityController) {
      // Infrastructure layer
      const municipalityRepository = new MunicipalitySequelizeRepository();

      // domain layer
      const municipalityDomainService = new MunicipalityDomainService(
        municipalityRepository
      );

      // Application layer
      const municipalityApplicationService = new MunicipalityApplicationService(
        municipalityDomainService
      );

      // Presentation layer
      this.municipalityController = new MunicipalityController(
        municipalityApplicationService
      );
    }

    return this.municipalityController;
  }

  /**
   * Creates and returns a PriceController instance
   * In a real app, this would be handled by a DI container
   */
  public static createPriceController(): PriceController {
    if (!this.priceController) {
      // Infrastructure layer
      const priceRepository = new PriceSequelizeRepository();
      const municipalityRepository = new MunicipalitySequelizeRepository();
      const packageRepository = new PackageSequelizeRepository();

      // Domain layer services
      const priceHistoryDomainService = new PriceHistoryDomainService(
        priceRepository
      );
      const priceDomainService = new PriceDomainService(
        priceRepository,
        packageRepository,
        municipalityRepository
      );

      // Application layer
      const priceApplicationService = new PriceApplicationService(
        priceRepository,
        priceHistoryDomainService,
        priceDomainService,
        municipalityRepository
      );

      // Presentation layer
      this.priceController = new PriceController(priceApplicationService);
    }

    return this.priceController;
  }

  /**
   * Creates and returns a PackageController instance
   * In a real app, this would be handled by a DI container
   */
  public static createPackageController(): PackageController {
    if (!this.packageController) {
      // Infrastructure layer
      const packageRepository = new PackageSequelizeRepository();
      const priceRepository = new PriceSequelizeRepository();
      const municipalityRepository = new MunicipalitySequelizeRepository();

      // Domain layer services
      const packageDomainService = new PackageDomainService(packageRepository);
      const priceHistoryDomainService = new PriceHistoryDomainService(
        priceRepository
      );
      const priceDomainService = new PriceDomainService(
        priceRepository,
        packageRepository,
        municipalityRepository
      );

      // Application layer services
      const priceApplicationService = new PriceApplicationService(
        priceRepository,
        priceHistoryDomainService,
        priceDomainService,
        municipalityRepository
      );

      const packageApplicationService = new PackageApplicationService(
        packageRepository,
        packageDomainService,
        priceApplicationService
      );

      // Presentation layer
      this.packageController = new PackageController(packageApplicationService);
    }

    return this.packageController;
  }
}
