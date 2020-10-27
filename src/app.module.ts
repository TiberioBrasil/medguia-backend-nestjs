import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsModule } from './actions/actions.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import appConfig from './config/app.config';
import { DoctorsModule } from './doctors/doctors.module';
import { LocationsModule } from './locations/locations.module';
import { PatientsModule } from './patients/patients.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SecretariesModule } from './secretaries/secretaries.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV === 'development' ? true : false,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production' ? true : false,
      envFilePath: process.env.NODE_ENV !== 'production' ? '.env' : null,
      load: [appConfig],
    }),
    ActionsModule,
    AuthModule,
    CommonModule,
    ProfilesModule,
    UsersModule,
    DoctorsModule,
    SecretariesModule,
    PatientsModule,
    LocationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
