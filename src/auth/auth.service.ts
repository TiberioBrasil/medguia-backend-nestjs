import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import TokenCreateDto from './dto/token-create.dto';
import TokenResponseDto from './dto/token-response.dto';
import { EncryptionService } from './encryption.service';
import TokenBlacklist from './entities/token-blacklist.entity';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(TokenBlacklist)
    private readonly blacklistRepo: Repository<TokenBlacklist>,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async validateCredentials(payload: TokenCreateDto): Promise<User> {
    const { email, password } = payload;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException(`Email or password invalid #001`);
    }

    const { status } = user;

    if (status === false) {
      throw new UnauthorizedException(`Your user has been disabled`);
    }

    const { password: hash } = user;

    try {
      await this.encryptionService.compareOrFail(password, hash);
    } catch (err) {
      throw new BadRequestException(`Email or password invalid #002`);
    }

    return user;
  }

  async create({ id }: User): Promise<TokenResponseDto> {
    const token = this.jwtService.sign({ sub: id });
    return { token };
  }

  async destroy(token: string): Promise<void> {
    const { iat, exp, sub } = this.jwtService.decode(token) as TokenPayload;

    this.blacklistRepo.save({
      token,
      sub,
      iat: new Date(iat * 1000),
      exp: new Date(exp * 1000),
    });
  }
}
