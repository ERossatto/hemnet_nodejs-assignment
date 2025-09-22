import * as express from "express";
import { ControllerFactory } from "../factories/controller.factory";

const router = express.Router();

/**
 * POST /municipalities
 * Create a new municipality
 */
router.post("/", async (req, res) => {
  try {
    const municipalityController =
      ControllerFactory.createMunicipalityController();
    const result = await municipalityController.createMunicipality(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

/**
 * GET /municipalities/:name
 * Get municipality by name
 */
router.get("/:name", async (req, res) => {
  try {
    const municipalityController =
      ControllerFactory.createMunicipalityController();
    const result = await municipalityController.getMunicipalityByName({
      name: req.params.name,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

export default router;
