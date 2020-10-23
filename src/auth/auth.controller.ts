import {
  Controller,
  Delete,
  Headers,
  HttpCode,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import { AuthService } from './auth.service';
import TokenResponseDto from './dto/token-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard('local'))
  async create(@Request() req: express.Request): Promise<TokenResponseDto> {
    // @ts-ignore
    return this.authService.create(req.user);
  }

  @Get('verify')
  @HttpCode(204)
  @UseGuards(AuthGuard())
  // eslint-disable-next-line
  verifyForgotToken(): any {}

  @Delete('logout')
  @HttpCode(202)
  @UseGuards(AuthGuard())
  async destroy(@Headers() headers: Record<string, string>): Promise<void> {
    const { authorization } = headers;
    console.log(authorization);
    const [, ...token] = authorization.split(' ');
    await this.authService.destroy(token.join(''));
  }
}
