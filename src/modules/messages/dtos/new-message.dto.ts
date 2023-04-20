import { IsString, MinLength } from 'class-validator';
import { IMessage } from '../interfaces/message.interface';

export class MessageDto implements IMessage {
  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @MinLength(1)
  message: string;
}
