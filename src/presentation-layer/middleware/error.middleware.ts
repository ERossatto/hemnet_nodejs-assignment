import { Request, Response, NextFunction } from "express";
import { isAppError } from "../../application-layer/errors/app-errors";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Map only application/presentation errors; infra-specific mapping stays in infra
  let status: number = 500;
  let clientMessage: string = "Internal server error";

  if (isAppError(err)) {
    status = err.status;
    clientMessage =
      err.message || (status < 500 ? "Bad Request" : "Internal server error");
  } else if (
    typeof err?.status === "number" &&
    err.status >= 400 &&
    err.status < 600
  ) {
    status = err.status;
    clientMessage =
      err.message || (status < 500 ? "Bad Request" : "Internal server error");
  }

  // Server-side logging (full details)
  console.error({
    name: err?.name,
    message: err?.message,
    stack: err?.stack,
    status,
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    details: err?.details,
  });

  res.status(status).json({ error: clientMessage });
}
