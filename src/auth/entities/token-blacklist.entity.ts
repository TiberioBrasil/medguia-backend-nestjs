import { User } from '../../users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

/**
 * Classe que representa a entidade TokenBlacklist no banco de dados.
 * Esta entidade possui indexação pelos campos sub e aud.
 */
@Entity()
export default class TokenBlacklist {
  /**
   * Valor do token
   */
  @PrimaryColumn({ nullable: false, length: 280 })
  token: string;

  /**
   * Valor do sub do token (entidade à quem o token pertence)
   */
  @Column({ nullable: false })
  @OneToOne(() => User)
  sub: string;

  /**
   * Valor do iat do token (timestamp que quando foi criado)
   */
  @Column({ nullable: false, type: 'timestamp' })
  iat: Date;

  /**
   * Valor do exp do token (timestamp que quando o token expirará)
   */
  @Column({ nullable: false, type: 'timestamp' })
  exp: Date;
}
