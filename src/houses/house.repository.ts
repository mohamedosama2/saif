import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
} from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { House, HouseDocument } from './models/house.model';
import * as _ from 'lodash';

@Injectable()
export class HouseRepository extends BaseAbstractRepository<House> {
  constructor(
    @InjectModel(House.name) private houseModel: Model<HouseDocument>,
  ) {
    super(houseModel);
  }
  async findAllMyFavourites(me: string) {
    return await this.houseModel.find({ favourites: me });
  }

  public async findAllWithPaginationOptionWithFiltrations(
    queryFiltersAndOptions: any,
    filters: any[],
    extraOptions: PaginateOptions = {},
  ) {
    const options: PaginateOptions = _.pick(queryFiltersAndOptions, [
      'page',
      'limit',
    ]);
    let docs;
    if (queryFiltersAndOptions.allowPagination) {
      let myAggregation = this.houseModel.aggregate(filters);
      docs = await (this.houseModel as any).aggregatePaginate(myAggregation, {
        ...options,
        ...extraOptions,
      });
    } else {
      docs = await this.houseModel.aggregate(filters);
    }
    return docs;
  }

  async findAllCitiesHouses() {
    return await this.houseModel.aggregate([
      { $group: { _id: { city: '$city' }, houseNumber: { $count: {} } } },
    ]);
  }
  async findNewestHouses() {
    return await this.houseModel.find().sort({ createdAt: -1 });
  }
}
