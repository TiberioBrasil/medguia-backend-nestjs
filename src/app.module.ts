import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ActionsModule } from './actions/actions.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
