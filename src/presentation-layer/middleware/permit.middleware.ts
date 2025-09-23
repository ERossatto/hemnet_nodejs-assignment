import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/http-errors";
import { AuthUser } from "./auth.middleware";

export function permit(...requiredPermissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthUser | undefined;
    if (!user) return next(new UnauthorizedError());

    const permissions = user.permissions ?? [];
    const allowed = requiredPermissions.some((p) => permissions.includes(p));
    if (!allowed) return next(new ForbiddenError());

    next();
  };
}
