import * as express from "express";
import { ControllerFactory } from "../factories/controller.factory";
import { auth } from "../middleware/auth.middleware";
import { permit } from "../middleware/permit.middleware";
import { asyncHandler } from "../utils/async-handler";

const router = express.Router();

/**
 * POST /packages/:packageType/price
 * Add a price to an existing package
 */
router.post(
  "/:packageType/price",
  auth(),
  permit("price:create"),
  asyncHandler(async (req, res) => {
    const packageController = ControllerFactory.createPackageController();
    await packageController.addPackagePrice(req, res);
  })
);

/**
 * POST /packages
 * Create a new package with initial price
 */
router.post(
  "/",
  auth(),
  permit("package:create"),
  asyncHandler(async (req, res) => {
    const packageController = ControllerFactory.createPackageController();
    await packageController.createPackage(req, res);
  })
);

export default router;
