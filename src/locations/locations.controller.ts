import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActionGuard, RequireAction } from 'src/auth/action.guard';
import { LocationsService } from './locations.service';

@UseGuards(AuthGuard('jwt'), ActionGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @RequireAction('locations.returnUFs')
  returnUFs() {
    return this.locationsService.returnUFs();
  }

  @Get(':uf')
  @RequireAction('locations.returnUFs/:id')
  returnCities(@Param('uf') uf: string) {
    return this.locationsService.returnCities(uf);
  }

  @Get(':uf/:cityId')
  @RequireAction('locations.returnUFs/:id')
  returnCityLocation(@Param('uf') uf: string, @Param('cityId') cityId: number) {
    return this.locationsService.returnCityLocation(uf, cityId);
  }

  @Get('place/:uf/:cityId')
  @RequireAction('locations.returnUFs/:id')
  returnGooglePlace(
    @Body('name') name: string,
    @Param('uf') uf: string,
    @Param('cityId') cityId: number,
  ) {
    return this.locationsService.returnGooglePlace(name, uf, cityId);
  }
}
