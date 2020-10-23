import { IsDefined, IsString, Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';

/**
 * Classe DTO (Data Transfer Object) que define os dados que vão ser passados
 * no body do método GET com suas respectivas validações e tipos
 */
export default class TokenCreateDto implements Partial<User> {
  /**
   * Nome de usuário
   */
  @IsDefined()
  @IsString()
  email: string;

  /**
   * Senha do usuário
   */
  @IsDefined()
  @IsString()
  @Length(6, 72)
  password: string;
}
