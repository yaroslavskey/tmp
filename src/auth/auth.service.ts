import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { AuthDocument, Auth } from './schemas/auth.schema';
import { genSalt, hash, compare } from 'bcryptjs';
import { USER_NOT_FOUND, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import * as sharp from 'sharp';
import * as path from 'path';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(authDto: AuthDto) {
    const salt = await genSalt(10);
    const newUser = new this.authModel({
      email: authDto.email,
      password: await hash(authDto.password, salt),
    });
    return newUser.save();
  }

  async findUser(email: string) {
    return this.authModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }
    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
