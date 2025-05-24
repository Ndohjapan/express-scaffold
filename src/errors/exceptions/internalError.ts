import en from "../../locale/en";

export class InternalErrorException extends Error {
  statusCode: number;
  error: Error;

  constructor(message: string = en['internal-server-error'], error?: Error) {
    super(message);
    this.name = 'InternalErrorException';
    this.statusCode = 500;
    this.error = error || this;
  }
}
