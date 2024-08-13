export class BadRequestError extends Error {
  code: string;
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'BAD_REQUEST';
    this.code = 'BAD_REQUEST';
    this.status = 400;
  }
}

export class UnauthorizedError extends Error {
  code: string;
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'UNAUTHORIZED';
    this.code = 'UNAUTHORIZED';
    this.status = 401;
  }
}

export class ForbiddenError extends Error {
  code: string;
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'FORBIDDEN';
    this.code = 'FORBIDDEN';
    this.status = 403;
  }
}
