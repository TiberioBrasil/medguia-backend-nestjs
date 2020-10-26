import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActionGuard, RequireAction } from 'src/auth/action.guard';
import { GetUserID } from 'src/auth/get-user-decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), ActionGuard)
  @RequireAction('users.index')
  async index(@Query() paginationQuery: PaginationQueryDto): Promise<User[]> {
    return await this.usersService.index(paginationQuery);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), ActionGuard)
  @RequireAction('users.index')
  async show(@Param('id') id: string): Promise<User> {
    return await this.usersService.show(id);
  }

  @Post()
  async create(@Body() createCoffeeDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createCoffeeDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), ActionGuard)
  @RequireAction('users.update')
  async update(
    @Param('id') id: string,
    @Body() updateCoffeeDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), ActionGuard)
  @RequireAction('users.delete')
  async destroy(@Param('id') id: string): Promise<User> {
    return await this.usersService.destroy(id);
  }
}
