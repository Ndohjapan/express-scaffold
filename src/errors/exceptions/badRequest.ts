
export class BadRequestException extends Error {
  public status: number;
  public error: Error;

  constructor(message: string, status?: number, error?: Error) {
    super(message);
    this.name = 'BadRequestException';
    this.status = status || 422;
    this.error = error || this;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}
