export class AppError extends Error {
  public status: number;
  public code?: string;
  public details?: unknown;

  constructor(
    status: number,
    message: string,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists", details?: unknown) {
    super(409, message, "CONFLICT", details);
  }
}

export const isAppError = (e: unknown): e is AppError => e instanceof AppError;
