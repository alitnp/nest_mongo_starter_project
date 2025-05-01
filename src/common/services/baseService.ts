// i want to create a base service class that can be extended by other services
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { AppPageSize } from 'src/common/config/configuration';
import { findAllQuery } from 'src/common/utils/queryStandardizer';
import {
  SuccessResponse,
  SuccessResponseData,
  SuccessResponseList,
} from 'src/common/utils/responseStandardizer';

@Injectable()
export class BaseService<T, createDto = any, updateDto = any> {
  /**
   * @param model - The Mongoose model representing the entity.
   * @param uniqueKeyIndicator - An optional key or array of keys used to determine
   * whether an entity already exists. This is typically used for uniqueness checks.
   * @param select - An optional field or array of fields to include in query results.
   * @param populate - An optional field or array of fields to populate in query results.
   */
  constructor(
    private readonly model: Model<T>,
    private readonly uniqueKeyIndicator?: string | string[],
    private readonly select?: string | string[],
    private readonly populate?: string | string[],
  ) {}

  async findAll(query?: findAllQuery<T>): Promise<SuccessResponseList<T>> {
    // get count of all items in the database
    const totalCount = await this.model.countDocuments(query || {});

    // get items from the database with pagination and filtering
    const itemsQuery = this.model.find(query || {});

    if (this.select) {
      itemsQuery.select(this.select);
    }

    if (this.populate) {
      itemsQuery.populate(this.populate);
    }

    const items = (await itemsQuery
      .skip(
        query?.pageNumber
          ? (query.pageNumber - 1) * (query.pageSize || AppPageSize)
          : 0,
      )
      .limit(query?.pageSize || AppPageSize)
      .lean()) as T[];

    // return the items in a standardized format
    return SuccessResponse.list<T>(
      items,
      query?.pageNumber || 1,
      query?.pageSize || AppPageSize,
      totalCount,
    );
  }

  async findOne(
    _id: string | mongoose.Schema.Types.ObjectId,
  ): Promise<SuccessResponseData<T>> {
    // check if the id is valid or not
    if (!mongoose.isValidObjectId(_id)) {
      // if not, throw an error
      throw new NotFoundException(`Invalid ID format: ${_id}`);
    }

    // check if the entity exists or not
    let entityQuery = this.model.findById(_id);

    if (this.select) {
      entityQuery = entityQuery.select(this.select);
    }

    if (this.populate) {
      entityQuery = entityQuery.populate(this.populate);
    }

    const entity = await entityQuery.lean();

    // if not, throw an error
    if (!entity) {
      throw new NotFoundException(`Entity with id ${_id} not found`);
    }

    // standardize the response and return it
    return SuccessResponse.data<T>(entity as T);
  }

  async create(createDto: createDto): Promise<SuccessResponseData<T>> {
    // check if the unique key is already exists
    await this.checkUniqueKey(this.uniqueKeyIndicator);

    // create the entity
    const entity = new this.model(createDto);

    // save it to the database
    await entity.save();

    const result = await this.findOne(entity._id as string);

    // standardize the response and return it
    return SuccessResponse.data<T>(result as T);
  }

  async update(
    _id: string | mongoose.Schema.Types.ObjectId,
    updateDto: updateDto,
  ): Promise<SuccessResponseData<T>> {
    // check if the id is valid or not
    if (!mongoose.isValidObjectId(_id)) {
      throw new NotFoundException(`Invalid ID format: ${_id}`);
    }

    // check if the entity exists or not
    const entity = await this.model.findById(_id);

    // if not, throw an error
    if (!entity) {
      throw new NotFoundException(`Entity with id ${_id} not found`);
    }

    // check if the unique key is already exists
    await this.checkUniqueKey(this.uniqueKeyIndicator);

    // update the entity with the new values
    // loop through the updateDto and update the entity with the new values
    for (const key in updateDto) {
      const itemKey = key as unknown as keyof T;
      if (!entity[itemKey] || itemKey === '_id') continue;
      entity[itemKey] = (updateDto[key] as any) || entity[itemKey];
    }

    // save the entity to the database
    await entity.save();
    const result = await this.findOne(_id);

    // if the entity is not found, throw an error
    if (!result) {
      throw new NotFoundException(`Entity with id ${_id} not found`);
    }

    // standardize the response and return it
    return SuccessResponse.data<T>(result as T);
  }

  async remove(
    _id: string | mongoose.Schema.Types.ObjectId,
  ): Promise<SuccessResponseData<T>> {
    // check if the id is valid or not
    if (!mongoose.isValidObjectId(_id)) {
      throw new NotFoundException(`Invalid ID format: ${_id}`);
    }

    // check if the entity exists or not
    const entity = await this.findOne(_id);

    // if not, throw an error
    if (!entity) {
      throw new NotFoundException(`Entity with id ${_id} not found`);
    }

    // remove the entity from the database
    const result = await this.model.findByIdAndDelete(_id);

    // if the entity is not found, throw an error
    if (!result) {
      throw new NotFoundException(`Entity with id ${_id} not found`);
    }

    // standardize the response and return it
    return SuccessResponse.data<T>(entity.data);
  }

  private async checkUniqueKey(indicator?: string | string[]): Promise<void> {
    // check if the indicator is not provided or empty return
    if (!indicator) return;

    // check if the indicator is an array or not
    if (Array.isArray(indicator)) {
      // loop through the array and check if the entity exists or not
      for (const key of indicator) {
        // check if the key is valid or not
        const entity = await this.model.findOne({
          [key]: this[key],
        } as unknown as mongoose.FilterQuery<T>);

        // if the entity is found, throw an error
        if (entity) {
          throw new BadRequestException(
            `Entity with ${key} ${this[key]} already exists`,
          );
        }
      }
    } else {
      // check if the indicator is a string or not
      const entity = await this.model.findOne({
        [indicator]: this[indicator],
      } as mongoose.FilterQuery<T>);

      // if the entity is found, throw an error
      if (entity) {
        throw new BadRequestException(
          `Entity with ${indicator} ${this[indicator]} already exists`,
        );
      }
    }
  }
}
