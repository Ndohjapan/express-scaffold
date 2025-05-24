
export class ValidationException extends Error {
  public readonly statusCode = 400;
  public readonly name = 'ValidationException';
  public readonly validationErrors: Array<{
    field: string;
    message: string;
    value?: any;
  }>;

  constructor(
    message: string = 'Validation failed',
    validationErrors: Array<{
      field: string;
      message: string;
      value?: any;
    }> = []
  ) {
    super(message);
    this.validationErrors = validationErrors;
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      validationErrors: this.validationErrors,
      timestamp: new Date().toISOString()
    };
  }
}