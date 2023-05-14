import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { HousesService } from './houses.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { User, UserDocument } from 'src/users/models/_user.model';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilterQueryOptionsHouse } from './dto/filterQueryOptions.dto';
import { PaginateResult } from 'mongoose';
import { HouseDocument } from './models/house.model';
import { CreateRateDto } from 'src/rate/dto/create-rate.dto';
import ParamsWithId from 'src/utils/paramsWithId.dto';
import { RateService } from 'src/rate/rate.service';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('houses')
@ApiTags('houses')
@ApiBearerAuth()
export class HousesController {
  constructor(
    private readonly housesService: HousesService,
    private readonly rateService: RateService,
  ) {}

  @Post() //ADD IMAGES
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 50 },
      { name: 'contractImage', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  create(
    @Body() createHouseDto: CreateHouseDto,
    @AuthUser() me: User,
    @UploadedFiles()
    files,
  ) {
    if (files && files.images)
      createHouseDto.images = files.images.map((image) => image.secure_url);

    if (files && files.contractImage)
      createHouseDto.contractImage = files.contractImage[0].secure_url;
    let updatedDto = {
      ...createHouseDto,
      location: {
        type: 'Point',
        coordinates: [createHouseDto.lat, createHouseDto.long],
      },
    };
    delete updatedDto['lat'];
    delete updatedDto['long'];

    return this.housesService.create(updatedDto, me);
  }

  @Post('make-favourite/:id')
  makeFavourite(@Param('id') id: string, @AuthUser() me: UserDocument) {
    return this.housesService.makeFavourite(id, me.id);
  }

  @Post('remove-favourite/:id')
  removeFavourite(@Param('id') id: string, @AuthUser() me: UserDocument) {
    return this.housesService.removeFavourite(id, me.id);
  }

  @Get()
  findAll(
    @Query() queryFiltersAndOptions: FilterQueryOptionsHouse,
  ): Promise<PaginateResult<HouseDocument> | HouseDocument[]> {
    return this.housesService.findAll(queryFiltersAndOptions);
  }

  @Get('/myFavourites')
  findAllMyFavourites(@AuthUser() me: UserDocument) {
    return this.housesService.findAllMyFavourites(me._id);
  }

  @Get('/cities')
  findAllCitiesHouses() {
    return this.housesService.findAllCitiesHouses();
  }

  @Public()
  @Get('/newest-houses')
  findNewestHouses() {
    return this.housesService.findNewestHouses();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.housesService.findOne(id);
  }

  @Post('/rate/:id')
  async addRate(
    @Body() createRateDto: CreateRateDto,
    @Param() { id }: ParamsWithId,
    @AuthUser() me: UserDocument,
  ) {
    return await this.rateService.create(createRateDto, 'houses', id, me._id);
  }

  @Get('/rates/:id')
  async getAllRates(
    @Param() { id }: ParamsWithId,
    @Query() PaginationParams: PaginationParams,
  ) {
    return await this.rateService.fetchAllRates(PaginationParams, 'houses', id);
  }
}
