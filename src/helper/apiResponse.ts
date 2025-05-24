import { Response } from 'express';

interface IResponseStatus {
  SUCCESS: number;
  ACCEPTED_SUCCESS: number;
  CREATED_SUCCESS: number;
  UPDATED_SUCCESS: number;
}

const ResponseStatus: IResponseStatus = {
  SUCCESS: 200,
  ACCEPTED_SUCCESS: 202,
  CREATED_SUCCESS: 200,
  UPDATED_SUCCESS: 204,
};

interface IApiResponse {
  statusCode: number;
  status: string;
  message: string;
  results: number;
  prepare(res: Response, response: IApiResponse): Response;
  send(res: Response): Response;
}

class ApiResponse implements IApiResponse {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly message: string;
  public readonly results: number = 0;

  constructor(
    status: string,
    statusCode: number,
    message: string,
    results: number
  ) {
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
    this.results = results;
  }

  protected _prepare(res: Response, response: IApiResponse): Response {
    return res.status(this.statusCode).json(ApiResponse.sanitize(response));
  }

  get prepare(): (res: Response, response: IApiResponse) => Response {
    return this._prepare.bind(this);
  }

  send(res: Response) {
    return this.prepare(res, this);
  }

  static sanitize(response: Record<string, any>): Record<string, any> {
    const clone: Record<string, any> = {};
    Object.assign(clone, response);
    delete clone.statusCode;
    for (const i in clone) {
      if (typeof clone[i] === 'undefined') delete clone[i];
    }
    return clone;
  }
}

interface ISuccessResponse<T> extends IApiResponse {
  data: T | null;
}

class SuccessResponse<T = any> extends ApiResponse implements ISuccessResponse<T> {
  public readonly data: T | null;

  constructor(data: T | null = null, numOfResults = 0, message = 'Successful') {
    super('success', ResponseStatus.SUCCESS, message, numOfResults);
    this.data = data;
  }
}

class CreateSuccessResponse<T = any> extends ApiResponse implements ISuccessResponse<T> {
  public readonly data: T | null;

  constructor(data: T | null = null, numOfResults = 0, message = 'Successful') {
    super('success', ResponseStatus.CREATED_SUCCESS, message, numOfResults);
    this.data = data;
  }
}

class UpdateSuccessResponse<T = any> extends ApiResponse implements ISuccessResponse<T> {
  public readonly data: T | null;

  constructor(data: T | null = null, numOfResults = 0, message = 'Successful') {
    super('success', ResponseStatus.UPDATED_SUCCESS, message, numOfResults);
    this.data = data;
  }
}

class AcceptSuccessResponse<T = any> extends ApiResponse implements ISuccessResponse<T> {
  public readonly data: T | null;

  constructor(data: T | null = null, numOfResults = 0, message = 'Successful') {
    super('success', ResponseStatus.ACCEPTED_SUCCESS, message, numOfResults);
    this.data = data;
  }
}

export {
  IApiResponse,
  ISuccessResponse,
  SuccessResponse,
  CreateSuccessResponse,
  UpdateSuccessResponse,
  AcceptSuccessResponse,
};
