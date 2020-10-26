import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActionGuard, RequireAction } from 'src/auth/action.guard';
import { GetUserID } from '../auth/get-user-decorator';
import { UpdateSecretaryDto } from './dto/update-secretary.dto';
import { Secretary } from './entities/secretary.entity';
import { SecretariesService } from './secretaries.service';

@UseGuards(AuthGuard('jwt'), ActionGuard)
@Controller('secretaries')
export class SecretariesController {
  constructor(private readonly secretariesService: SecretariesService) {}

  @Post()
  @RequireAction('secretaries.create')
  async create(@GetUserID() getUserID): Promise<Secretary> {
    return await this.secretariesService.create(getUserID);
  }

  @Patch()
  @RequireAction('secretaries.update')
  async update(
    @GetUserID() getUserID,
    @Body() updateSecretaryDto: UpdateSecretaryDto,
  ): Promise<Secretary> {
    return await this.secretariesService.update(getUserID, updateSecretaryDto);
  }

  @Delete()
  @RequireAction('secretaries.destroy')
  async destroy(@GetUserID() getUserID): Promise<Secretary> {
    return await this.secretariesService.destroy(getUserID);
  }
}
