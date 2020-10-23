import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { TokenPayload } from './interfaces/token-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TokenBlacklist from './entities/token-blacklist.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(TokenBlacklist)
    private readonly blacklistRepo: Repository<TokenBlacklist>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(req: Request, payload: TokenPayload): Promise<Partial<User>> {
    // @ts-ignore
    const token = req.headers.authorization.replace(/^Bearer\s+/, '');

    const blacklistToken = await this.blacklistRepo.findOne({
      where: { token, sub: payload.sub },
    });

    if (blacklistToken) {
      throw new UnauthorizedException();
    }

    return { id: payload.sub };
  }
}
