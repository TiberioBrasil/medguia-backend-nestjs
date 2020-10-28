import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    userId: string,
    createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    const checkIfPatientExists = await this.patientsRepository.find({
      document: createPatientDto.document,
    });

    if (checkIfPatientExists.length > 0) {
      throw new BadRequestException(
        `A Patient with that document already exists`,
      );
    }

    const user = await this.usersRepository.findOne(userId);

    const patient = this.patientsRepository.create(createPatientDto);
    if (user) {
      patient.users = [user];
    }
    return await this.patientsRepository.save(patient);
  }

  async createUserRelation(
    userId: string,
    patientDocument: string,
  ): Promise<Patient> {
    const user = await this.usersRepository.findOne(userId);

    const patient = await this.patientsRepository.findOne({
      where: { document: patientDocument },
      relations: ['users'],
    });

    if (!patient) {
      throw new BadRequestException(`Patient not found`);
    }

    const checkIfRelationExists = patient.users.filter(u => u.id === user.id);

    if (checkIfRelationExists.length > 0) {
      throw new BadRequestException(`This relation already exists`);
    }

    const usersRelations = patient.users;
    usersRelations.push(user);
    patient.users = usersRelations;

    return await this.patientsRepository.save(patient);
  }

  async deleteUserRelation(
    userId: string,
    patientDocument: string,
  ): Promise<Patient> {
    const user = await this.usersRepository.findOne(userId);

    const patient = await this.patientsRepository.findOne({
      where: { document: patientDocument },
      relations: ['users'],
    });

    if (!patient) {
      throw new BadRequestException(`Patient not found`);
    }

    const checkIfRelationExists = patient.users.filter(u => u.id === user.id);

    if (checkIfRelationExists.length === 0) {
      throw new BadRequestException(`Relation not found`);
    }

    const usersRelations = patient.users.filter(u => u.id !== user.id);
    patient.users = usersRelations;

    return await this.patientsRepository.save(patient);
  }
}
