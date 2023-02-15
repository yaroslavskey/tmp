import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Patch,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('User controller')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users from collection' })
  @ApiResponse({ status: 200, type: [User] })
  @Get('/')
  getAllUsers() {
    return this.userService.getAll();
  }

  @ApiOperation({ summary: 'Created user' })
  @ApiResponse({ status: 200, type: User })
  @Post('/')
  @UsePipes(ValidationPipe)
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, type: User })
  @Delete('/:id')
  deleteUser(@Param('id') id: ObjectId) {
    return this.userService.delete(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: User })
  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateUser(@Param('id') id: ObjectId, @Body() dto: CreateUserDto) {
    return this.userService.update(id, dto);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: User })
  @Patch('/:id')
  @UsePipes(ValidationPipe)
  patchUser(@Param('id') id: ObjectId, @Body() dto: PatchUserDto) {
    return this.userService.patch(id, dto);
  }

  @ApiOperation({ summary: 'Find user by email' })
  @ApiResponse({ status: 200, type: User })
  @Get('/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2097152 }),
          new FileTypeValidator({ fileType: 'jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const resized = await this.userService.convertToWebPandResaze(
      file.filename,
      true,
    );
    const filepath = path.join(__dirname, '../../uploads/');
    fs.readdir(filepath, (err, files) => {
      files.forEach((file) => {
        console.log('upload files', file);
      });
    });

    const GCPresized = await this.userService
      .uploadFileGCP(resized, file.filename, true)
      .catch(console.error);
    const original = await this.userService.convertToWebPandResaze(
      file.filename,
      false,
    );
    const GCPoriginal = await this.userService
      .uploadFileGCP(original, file.filename, false)
      .catch(console.error);
    return {
      thumbnail: `https://storage.cloud.google.com/upload-first/${GCPresized}`,
      original: `https://storage.cloud.google.com/upload-first/${GCPoriginal}`,
    };
  }
}
