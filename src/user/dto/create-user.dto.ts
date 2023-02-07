import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'a@a.com', description: 'User email adress'})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Volodymyr', description: 'User first name'})
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Naradovyi', description: 'User last name'})
  @IsNotEmpty()
  secondName: string;

  @ApiProperty({ example: '123', description: 'User password'})
  @IsNotEmpty()
  password: string;
}
