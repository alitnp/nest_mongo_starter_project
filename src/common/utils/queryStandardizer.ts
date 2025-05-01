import { FindManyOptions } from 'typeorm';

export interface findAllQuery<T> extends FindManyOptions<T> {
  pageNumber?: number;
  pageSize?: number;
}
