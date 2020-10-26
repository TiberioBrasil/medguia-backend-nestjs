import { IsOptional, IsString } from 'class-validator';

export class UpdateSecretaryDto {
  @IsString()
  @IsOptional()
  readonly phoneNumber: string;
}
