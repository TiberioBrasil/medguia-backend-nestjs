import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../decorators/match.decorator';

export class CreateUserDto {
  @IsString()
  @MinLength(11)
  @MaxLength(11)
  readonly document: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(72)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password should contain at least: 1 uppercase letter, 1 lower case letter and 1 number or special character.',
  })
  readonly password: string;

  @IsString()
  @Match('password', { message: 'The password confirmation does not match' })
  readonly passwordConfirmation: string;
}
