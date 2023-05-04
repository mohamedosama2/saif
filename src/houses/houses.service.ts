import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { User } from 'src/users/models/_user.model';
import { HouseRepository } from './house.repository';
import { FilterQueryOptionsHouse } from './dto/filterQueryOptions.dto';

@Injectable()
export class HousesService {
  constructor(private readonly houseRepositary: HouseRepository) {}
  async create(createHouseDto: CreateHouseDto, me: User) {
    return await this.houseRepositary.create({
      ...createHouseDto,
      owner: me.id,
    });
  }

  async makeFavourite(id: string, myId: string) {
    return await this.houseRepositary.updateOneVoid(
      { _id: id },
      { $addToSet: { favourites: myId } as any },
    );
  }
  async removeFavourite(id: string, myId: string) {
    return await this.houseRepositary.updateOneVoid(
      { _id: id },
      { $pull: { favourites: myId } as any },
    );
  }
  async findAllMyFavourites(me: string) {
    let myFavourites = await this.houseRepositary.findAllMyFavourites(me);
    if (myFavourites.length === 0)
      throw new NotFoundException('no Favourites yet');
    return myFavourites;
  }

  async findAll(queryFiltersAndOptions: FilterQueryOptionsHouse) {
    console.log(queryFiltersAndOptions);
    let filters = [];
    if (queryFiltersAndOptions.city)
      filters = [...filters, { $match: { city: queryFiltersAndOptions.city } }];
    if (
      queryFiltersAndOptions.minimum_price &&
      queryFiltersAndOptions.highest_price
    ) {
      filters = [
        ...filters,
        {
          $match: {
            $and: [
              { price: { $lte: queryFiltersAndOptions.highest_price } },
              { price: { $gte: queryFiltersAndOptions.minimum_price } },
            ],
          },
        },
      ];
    }

    if (queryFiltersAndOptions.start_date && queryFiltersAndOptions.end_date) {
      filters = [
        ...filters,
        {
          $lookup: {
            from: 'reservations',
            localField: 'reservations',
            foreignField: '_id',
            as: 'reservations',
          },
        },
        {
          $match: {
            $or: [
              {
                'reservations.start_date': {
                  $gt: queryFiltersAndOptions.end_date,
                },
              },
              {
                'reservations.end_date': {
                  $lt: queryFiltersAndOptions.start_date,
                },
              },
            ],
          },
        },
      ];
    }

    if (queryFiltersAndOptions.persons) {
      filters = [
        ...filters,
        { $match: { persons: { $gte: queryFiltersAndOptions.persons } } },
      ];
    }
    if (queryFiltersAndOptions.children) {
      filters = [
        ...filters,
        { $match: { children: { $gte: queryFiltersAndOptions.children } } },
      ];
    }
    if (queryFiltersAndOptions.rooms) {
      filters = [
        ...filters,
        { $match: { rooms: { $gte: queryFiltersAndOptions.rooms } } },
      ];
    }

    console.log('Filters', filters);
    return await this.houseRepositary.findAllWithPaginationOptionWithFiltrations(
      queryFiltersAndOptions,
      filters,
      /*  {
        populate: {
          path: 'reservations',
          match: { start_date: { $gte: queryFiltersAndOptions.start_date } },
        },
      }, */
    );
  }

  async findOne(id: string) {
    return await this.houseRepositary.findOne({ id });
  }

  async findAllCitiesHouses() {
    return await this.houseRepositary.findAllCitiesHouses();
  }
  async findNewestHouses() {
    return await this.houseRepositary.findNewestHouses();
  }
}
