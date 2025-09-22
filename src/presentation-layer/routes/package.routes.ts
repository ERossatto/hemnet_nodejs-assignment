import * as express from "express";
import { ControllerFactory } from "../factories/controller.factory";

const router = express.Router();

/**
 * POST /packages/:packageType/price
 * Add a price to an existing package
 */
router.post("/:packageType/price", async (req, res) => {
  try {
    const packageController = ControllerFactory.createPackageController();
    await packageController.addPackagePrice(req, res);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

/**
 * POST /packages
 * Create a new package with initial price
 */
router.post("/", async (req, res) => {
  try {
    const packageController = ControllerFactory.createPackageController();
    await packageController.createPackage(req, res);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

export default router;
