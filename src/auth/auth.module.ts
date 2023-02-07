import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema, Auth } from './schemas/auth.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { getJWTConfig } from './configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    PassportModule,
    MulterModule.register({ dest: './uploads' }),
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
