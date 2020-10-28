import { IsString } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  readonly placeId: string;
}
