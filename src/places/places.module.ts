import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Place } from './entities/place.entity';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';

@Module({
  imports: [TypeOrmModule.forFeature([Place, User]), HttpModule],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
