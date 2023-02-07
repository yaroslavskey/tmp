import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
  UsePipes,
  BadRequestException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ALREDY_REGISTERED_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guard';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() authDto: AuthDto) {
    const oldUser = await this.authService.findUser(authDto.email);
    if (oldUser) {
      throw new BadRequestException(ALREDY_REGISTERED_ERROR);
    }
    return this.authService.register(authDto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const { email } = await this.authService.validateUser(
      authDto.email,
      authDto.password,
    );
    return this.authService.login(email);
  }
}
