import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { PingResponse } from './interfaces/ping-response.interface';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Get('ping')
  ping(): PingResponse {
    return { message: 'pong' };
  }
}
