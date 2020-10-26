import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { SecretariesController } from './secretaries.controller';
import { SecretariesService } from './secretaries.service';
import { Secretary } from './entities/secretary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Secretary, User])],
  controllers: [SecretariesController],
  providers: [SecretariesService],
})
export class SecretariesModule {}
