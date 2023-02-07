import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as sharp from 'sharp';
import * as path from 'path';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async create(dto: CreateUserDto): Promise<User> {
    return await this.userModel.create(dto);
  }

  async delete(id: ObjectId): Promise<User> {
    return await this.userModel.findByIdAndDelete(id);
  }

  async update(id: ObjectId, dto: CreateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, dto);
  }

  async patch(id: ObjectId, dto: PatchUserDto) {
    return await this.userModel.findByIdAndUpdate(id, dto);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async convertToWebPandResaze(name, resize) {
    const filepath = path.join(__dirname, '../../uploads/');
    const compresedName = path.join(
      filepath,
      name.split('.')[0] + resize + '.webp',
    );
    try {
      if (resize) {
        await sharp(path.join(filepath, name))
          .webp()
          .resize({
            width: 320,
            height: 320,
          })
          .toFile(compresedName);
      } else {
        await sharp(path.join(filepath, name)).webp().toFile(compresedName);
      }
    } catch (error) {
      console.log(error);
    }
    return compresedName;
  }

  async uploadFileGCP(filePath, name, resize) {
    const storage = new Storage();
    const options = {
      destination: name.split('.')[0] + resize + '.webp',
      preconditionOpts: { ifGenerationMatch: 0 },
    };

    await storage.bucket('upload-first').upload(filePath, options);
    console.log(`${filePath} uploaded to ${'upload-first'}`);
    return name.split('.')[0] + resize + '.webp';
  }
}
