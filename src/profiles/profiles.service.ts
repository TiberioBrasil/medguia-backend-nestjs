import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService extends TypeOrmCrudService<Profile> {
  constructor(@InjectRepository(Profile) repo) {
    super(repo);
  }
}
