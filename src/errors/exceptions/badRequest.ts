import en from "../../locale/en";

export class BadRequestException extends Error {
  statusCode: number;
  error: Error;

  constructor(message: string = en['bad-request-error'], statusCode?: number, error?: Error) {
    super(message)
    this.name = 'BadRequestException';
    this.statusCode = statusCode || 422;
    this.error = error || this;
  }
}

