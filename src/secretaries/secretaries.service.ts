import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateSecretaryDto } from './dto/update-secretary.dto';
import { Secretary } from './entities/secretary.entity';

@Injectable()
export class SecretariesService {
  constructor(
    @InjectRepository(Secretary)
    private readonly secretariesRepository: Repository<Secretary>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: string): Promise<Secretary> {
    const checkIfSecretaryExists = await this.secretariesRepository.findOne({
      where: { userId },
    });

    if (checkIfSecretaryExists) {
      throw new BadRequestException(`User already created a Secretary profile`);
    }

    let secretary = this.secretariesRepository.create({
      userId,
    });
    secretary = await this.secretariesRepository.save(secretary);

    const user = await this.userRepository.findOne(userId);
    user.secretary = secretary;
    user.secretaryId = secretary.id;
    await this.userRepository.save(user);

    return secretary;
  }

  async update(
    userId: string,
    updateSecretaryDto: UpdateSecretaryDto,
  ): Promise<Secretary> {
    const checkIfSecretaryExists = await this.secretariesRepository.findOne({
      userId,
    });

    if (!checkIfSecretaryExists) {
      throw new BadRequestException('Secretary profile not found');
    }

    const secretary = await this.secretariesRepository.preload({
      id: checkIfSecretaryExists.id,
      ...updateSecretaryDto,
    });
    if (!secretary) {
      throw new NotFoundException(`Secretary profile not found`);
    }
    return this.secretariesRepository.save(secretary);
  }

  async destroy(userId: string): Promise<Secretary> {
    const checkIfSecretaryExists = await this.secretariesRepository.findOne({
      userId,
    });

    if (!checkIfSecretaryExists) {
      throw new BadRequestException('Secretary profile not found');
    }

    checkIfSecretaryExists.deleted_at = new Date();

    const user = await this.userRepository.findOne(userId);
    user.secretary = null;
    await this.userRepository.save(user);

    return this.secretariesRepository.save(checkIfSecretaryExists);
  }
}
