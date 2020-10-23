import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Action } from './entities/action.entity';

@Injectable()
export class ActionsService extends TypeOrmCrudService<Action> {
  constructor(@InjectRepository(Action) repo) {
    super(repo);
  }
}
