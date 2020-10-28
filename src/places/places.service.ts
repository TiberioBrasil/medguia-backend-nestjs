import {
  BadGatewayException,
  BadRequestException,
  HttpService,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePlaceDto } from './dto/create-place.dto';
import { Place } from './entities/place.entity';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placesRepository: Repository<Place>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private httpService: HttpService,
  ) {}

  async create(userId: string, createPlaceDto: CreatePlaceDto): Promise<Place> {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json?key=` +
      `${process.env.GOOGLE_PLACE_KEY}` +
      `&place_id=${createPlaceDto.placeId}` +
      `&fields=name,formatted_address,geometry`;

    const response = await this.httpService.get(url).toPromise();
    if (response.data.status !== 'OK') {
      throw new BadRequestException(response.data.status);
    }

    const checkIfPlaceIdExists = await this.placesRepository.find({
      where: { placeId: createPlaceDto.placeId },
    });

    if (checkIfPlaceIdExists.length > 0) {
      throw new BadGatewayException('Place already exists');
    }

    const place = new Place();
    place.placeId = createPlaceDto.placeId;
    place.name = response.data.result.name;
    place.address = response.data.result.formatted_address;
    place.latitude = response.data.result.geometry.location.lat;
    place.longitude = response.data.result.geometry.location.lng;

    const createPlace = this.placesRepository.create(place);
    const createdPlace = await this.placesRepository.save(createPlace);

    await this.createUserRelation(userId, createPlaceDto.placeId);

    return createdPlace;
  }

  async createUserRelation(userId: string, placeId: string): Promise<Place> {
    const user = await this.usersRepository.findOne(userId);

    const place = await this.placesRepository.findOne({
      where: { placeId },
      relations: ['users'],
    });

    if (!place) {
      throw new BadRequestException(`Place not found`);
    }

    const checkIfRelationExists = place.users.filter(u => u.id === user.id);

    if (checkIfRelationExists.length > 0) {
      throw new BadRequestException(`This relation already exists`);
    }

    const usersRelations = place.users;
    usersRelations.push(user);
    place.users = usersRelations;

    return await this.placesRepository.save(place);
  }

  async deleteUserRelation(userId: string, placeId: string): Promise<Place> {
    const user = await this.usersRepository.findOne(userId);

    const place = await this.placesRepository.findOne({
      where: { placeId },
      relations: ['users'],
    });

    if (!place) {
      throw new BadRequestException(`Place not found`);
    }

    const checkIfRelationExists = place.users.filter(u => u.id === user.id);

    if (checkIfRelationExists.length === 0) {
      throw new BadRequestException(`Relation not found`);
    }

    const usersRelations = place.users.filter(u => u.id !== user.id);
    place.users = usersRelations;

    return await this.placesRepository.save(place);
  }
}
