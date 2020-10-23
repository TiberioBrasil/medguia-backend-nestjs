import { IsDefined, IsString } from 'class-validator';

/**
 * Classe DTO (Data Transfer Object) que define os dados que vão ser passados
 * no body do método POST com suas respectivas validações e tipos
 */
export default class TokenResponseDto {
  /**
   * Nome de usuário
   */
  @IsDefined()
  @IsString()
  token: string;
}
