// create a static class successResponse With to methods, data and list, so data will be used for single object and list will be used for array of objects,

import { AppPageSize } from 'src/common/config/configuration';

export interface SuccessResponseList<T> {
  data: T[];
  statusCode: number;
  message: string;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface SuccessResponseData<T> {
  data: T;
  statusCode: number;
  message: string;
}

export class SuccessResponse {
  static data<T>(data: T, message: string = 'Success'): SuccessResponseData<T> {
    return {
      data: data,
      statusCode: 200,
      message: message,
    };
  }

  static list<T>(
    data: T[] = [],
    pageNumber: number = 1,
    pageSize: number = AppPageSize,
    totalCount: number = 0,
    message: string = 'Success',
  ): SuccessResponseList<T> {
    return {
      data: data,
      statusCode: 200,
      message: message,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }
}
