import {
  HttpService,
  BadGatewayException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
    private httpService: HttpService,
  ) {}

  returnUFs() {
    return {
      AC: 'Acre',
      AL: 'Alagoas',
      AP: 'Amapá',
      AM: 'Amazonas',
      BA: 'Bahia',
      CE: 'Ceará',
      DF: 'Distrito Federal',
      ES: 'Espírito Santo',
      GO: 'Goías',
      MA: 'Maranhão',
      MT: 'Mato Grosso',
      MS: 'Mato Grosso do Sul',
      MG: 'Minas Gerais',
      PA: 'Pará',
      PB: 'Paraíba',
      PR: 'Paraná',
      PE: 'Pernambuco',
      PI: 'Piauí',
      RJ: 'Rio de Janeiro',
      RN: 'Rio Grande do Norte',
      RS: 'Rio Grande do Sul',
      RO: 'Rondônia',
      RR: 'Roraíma',
      SC: 'Santa Catarina',
      SP: 'São Paulo',
      SE: 'Sergipe',
      TO: 'Tocantins',
    };
  }

  async returnCities(uf: string) {
    return await this.locationsRepository.find({
      where: [{ uf: uf.toUpperCase() }],
      order: { name: 'ASC' },
    });
  }

  async returnCityLocation(uf: string, cityId: number) {
    const city = await this.locationsRepository.findOne(cityId);
    if (!city) {
      throw new BadGatewayException('City not found');
    }
    return city;
  }

  async returnGooglePlace(name: string, uf: string, cityId: number) {
    const getCityLocation = await this.returnCityLocation(uf, cityId);

    const url =
      `https://maps.googleapis.com/maps/api/place/textsearch/json?key=` +
      `${process.env.GOOGLE_PLACE_KEY}` +
      `&location=${getCityLocation.latitude},${getCityLocation.longitude}` +
      `&radius=100` +
      `&query=${name}` +
      `&type=health` +
      `&region=br`;

    console.log(url);
    const response = await this.httpService.get(url).toPromise();
    if (response.data.results.length === 0) {
      throw new BadRequestException(response.data.status);
    }

    const formattedResponse = response.data.results.map(item => {
      return {
        name: item.name,
        place_id: item.place_id,
        address: item.formatted_address,
        latitude: item.geometry.location.lat,
        longitude: item.geometry.location.lng,
        cityId,
        city: getCityLocation.name,
        state: uf,
      };
    });
    return formattedResponse;
  }
}
