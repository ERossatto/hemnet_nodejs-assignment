import { type Request, type Response } from "express";
import PackageService from "@application/services/package.service";

export default {
  async getAll(_: Request, response: Response) {
    const packages = await PackageService.getAll();

    response.send({ packages });
  },
};
