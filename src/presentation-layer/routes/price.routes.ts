import * as express from "express";
import { ControllerFactory } from "../factories/controller.factory";

const router = express.Router();

/**
 * GET /prices/history
 * Get price history for a package type
 */
router.get("/history", async (req, res) => {
  try {
    const priceController = ControllerFactory.createPriceController();
    await priceController.getPriceHistory(req, res);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

/**
 * GET /prices/current
 * Get current price for a package type
 */
router.get("/current", async (req, res) => {
  try {
    const priceController = ControllerFactory.createPriceController();
    await priceController.getCurrentPrice(req, res);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

/**
 * GET /prices/package/:packageType
 * Get all prices for a specific package type
 */
router.get("/package/:packageType", async (req, res) => {
  try {
    const priceController = ControllerFactory.createPriceController();
    await priceController.getAllPricesForPackageType(req, res);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

/**
 * POST /prices
 * Create a new price
 */
router.post("/", async (req, res) => {
  try {
    const priceController = ControllerFactory.createPriceController();
    await priceController.createPrice(req, res);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

export default router;
