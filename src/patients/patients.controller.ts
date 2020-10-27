import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActionGuard, RequireAction } from '../auth/action.guard';
import { GetUserID } from '../decorators/get-user.decorator';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientsService } from './patients.service';

@UseGuards(AuthGuard('jwt'), ActionGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @RequireAction('patients.create')
  async create(
    @GetUserID() getUserID: string,
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    return await this.patientsService.create(getUserID, createPatientDto);
  }

  @Post(':document')
  @RequireAction('patients.createUserRelation')
  async createUserRelation(
    @GetUserID() getUserID: string,
    @Param('document') patientDocument: string,
  ): Promise<Patient> {
    return await this.patientsService.createUserRelation(
      getUserID,
      patientDocument,
    );
  }

  @Delete(':document')
  @RequireAction('patients.deleteUserRelation')
  async deleteUserRelation(
    @GetUserID() getUserID: string,
    @Param('document') patientDocument: string,
  ): Promise<Patient> {
    return await this.patientsService.deleteUserRelation(
      getUserID,
      patientDocument,
    );
  }
}
