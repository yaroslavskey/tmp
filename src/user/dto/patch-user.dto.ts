import { IsEmail } from 'class-validator';

export class PatchUserDto {
  @IsEmail()
  email: string;

  firstName: string;
  secondName: string;
  password: string;
}
