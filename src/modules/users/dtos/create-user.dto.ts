import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  password: string;

  @IsString()
  @MinLength(1)
  name: string;
}
