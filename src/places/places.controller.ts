import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActionGuard, RequireAction } from '../auth/action.guard';
import { GetUserID } from '../decorators/get-user.decorator';
import { CreatePlaceDto } from './dto/create-place.dto';
import { Place } from './entities/place.entity';
import { PlacesService } from './places.service';

@UseGuards(AuthGuard('jwt'), ActionGuard)
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @RequireAction('places.searchPlace')
  async create(
    @GetUserID() getUserID: string,
    @Body() createPlaceDto: CreatePlaceDto,
  ): Promise<Place> {
    return await this.placesService.create(getUserID, createPlaceDto);
  }

  @Post(':placeId')
  @RequireAction('places.createUserRelation')
  async createUserRelation(
    @GetUserID() getUserID: string,
    @Param('placeId') placeId: string,
  ): Promise<Place> {
    return await this.placesService.createUserRelation(getUserID, placeId);
  }

  @Delete(':placeId')
  @RequireAction('places.deleteUserRelation')
  async deleteUserRelation(
    @GetUserID() getUserID: string,
    @Param('placeId') placeId: string,
  ): Promise<Place> {
    return await this.placesService.deleteUserRelation(getUserID, placeId);
  }
}
