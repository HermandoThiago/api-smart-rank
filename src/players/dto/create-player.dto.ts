import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlayerDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
