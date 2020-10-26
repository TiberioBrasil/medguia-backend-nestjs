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
import { DoctorsService } from './doctors.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';

@UseGuards(AuthGuard('jwt'), ActionGuard)
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @RequireAction('doctors.create')
  async create(@GetUserID() getUserID): Promise<Doctor> {
    return await this.doctorsService.create(getUserID);
  }

  @Patch()
  @RequireAction('doctors.update')
  async update(
    @GetUserID() getUserID,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return await this.doctorsService.update(getUserID, updateDoctorDto);
  }

  @Delete()
  @RequireAction('doctors.destroy')
  async destroy(@GetUserID() getUserID): Promise<Doctor> {
    return await this.doctorsService.destroy(getUserID);
  }
}
