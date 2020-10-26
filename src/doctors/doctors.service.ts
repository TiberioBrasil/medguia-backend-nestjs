import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: string): Promise<Doctor> {
    const checkIfDoctorExists = await this.doctorRepository.findOne({
      where: { userId },
    });

    if (checkIfDoctorExists) {
      throw new BadRequestException(`User already created a Doctor profile`);
    }

    let doctor = this.doctorRepository.create({
      userId,
    });
    doctor = await this.doctorRepository.save(doctor);

    const user = await this.userRepository.findOne(userId);
    user.doctor = doctor;
    user.doctorId = doctor.id;
    await this.userRepository.save(user);

    return doctor;
  }

  async update(
    userId: string,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    const checkIfDoctorExists = await this.doctorRepository.findOne({ userId });

    if (!checkIfDoctorExists) {
      throw new BadRequestException('Doctor profile not found');
    }

    const doctor = await this.doctorRepository.preload({
      id: checkIfDoctorExists.id,
      ...updateDoctorDto,
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor profile not found`);
    }
    return this.doctorRepository.save(doctor);
  }

  async destroy(userId: string): Promise<Doctor> {
    const checkIfDoctorExists = await this.doctorRepository.findOne({ userId });

    if (!checkIfDoctorExists) {
      throw new BadRequestException('Doctor profile not found');
    }

    checkIfDoctorExists.deleted_at = new Date();

    const user = await this.userRepository.findOne(userId);
    user.doctor = null;
    await this.userRepository.save(user);

    return this.doctorRepository.save(checkIfDoctorExists);
  }
}
