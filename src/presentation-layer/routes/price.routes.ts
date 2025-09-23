import * as express from "express";
import { ControllerFactory } from "../factories/controller.factory";
import { auth } from "../middleware/auth.middleware";
import { permit } from "../middleware/permit.middleware";
import { asyncHandler } from "../utils/async-handler";

const router = express.Router();

/**
 * GET /prices/history
 * Get price history for a package type
 */
router.get(
  "/history",
  auth(),
  permit("price:read"),
  asyncHandler(async (req, res) => {
    const priceController = ControllerFactory.createPriceController();
    await priceController.getPriceHistory(req, res);
  })
);

/**
 * GET /prices/current
 * Get current price for a package type
 */
router.get(
  "/current",
  auth(),
  permit("price:read"),
  asyncHandler(async (req, res) => {
    const priceController = ControllerFactory.createPriceController();
    await priceController.getCurrentPrice(req, res);
  })
);

/**
 * GET /prices/package/:packageType
 * Get all prices for a specific package type
 */
router.get(
  "/package/:packageType",
  auth(),
  permit("price:read"),
  asyncHandler(async (req, res) => {
    const priceController = ControllerFactory.createPriceController();
    await priceController.getAllPricesForPackageType(req, res);
  })
);

/**
 * POST /prices
 * Create a new price
 */
router.post(
  "/",
  auth(),
  permit("price:create"),
  asyncHandler(async (req, res) => {
    const priceController = ControllerFactory.createPriceController();
    await priceController.createPrice(req, res);
  })
);

export default router;
