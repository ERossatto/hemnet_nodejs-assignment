import { ConflictError } from "../../../application-layer/errors/app-errors";

export function isSequelizeUnique(err: any): boolean {
  return (
    err?.name === "SequelizeUniqueConstraintError" ||
    err?.original?.code === "SQLITE_CONSTRAINT" ||
    err?.parent?.code === "SQLITE_CONSTRAINT"
  );
}

export async function withOrmErrorTranslation<T>(
  action: () => Promise<T>,
  opts?: { conflictMessage?: string }
): Promise<T> {
  try {
    return await action();
  } catch (err: any) {
    if (isSequelizeUnique(err)) {
      throw new ConflictError(
        opts?.conflictMessage ?? "Resource already exists"
      );
    }
    throw err;
  }
}
