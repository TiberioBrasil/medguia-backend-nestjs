import { IsOptional, IsString } from 'class-validator';

export class UpdateDoctorDto {
  @IsString()
  @IsOptional()
  readonly professionalDocument: string;
}
