export class HttpError extends Error {
  public status: number;
  public expose: boolean;
  public details?: unknown;

  constructor(
    status: number,
    message: string,
    expose = true,
    details?: unknown
  ) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.expose = expose;
    this.details = details;
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, details?: unknown) {
    super(400, message, true, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(401, message, true, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", details?: unknown) {
    super(403, message, true, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not Found", details?: unknown) {
    super(404, message, true, details);
  }
}
