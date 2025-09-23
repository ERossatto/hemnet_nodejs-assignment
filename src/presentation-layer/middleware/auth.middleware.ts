import { Request, Response, NextFunction } from "express";
import nJwt from "njwt";
import { UnauthorizedError } from "../errors/http-errors";

export interface AuthUser {
  id: string;
  roles: string[];
  permissions?: string[];
}

export function auth(required = true) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header) {
      if (!required) return next();
      return next(new UnauthorizedError());
    }

    const token = header.replace(/^Bearer\s+/i, "");
    try {
      const verified: any = nJwt.verify(
        token,
        process.env.JWT_SECRET || "dev-secret"
      );

      const claims = verified?.body ?? {};
      const user: AuthUser = {
        id: String(claims.sub || claims.id || "user"),
        roles: Array.isArray(claims.roles) ? claims.roles : [],
        permissions: Array.isArray(claims.permissions)
          ? claims.permissions
          : [],
      };

      (req as any).user = user;
      next();
    } catch (_err) {
      return next(new UnauthorizedError("Invalid token"));
    }
  };
}
