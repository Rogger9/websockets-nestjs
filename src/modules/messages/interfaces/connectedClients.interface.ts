import { Socket } from 'socket.io';
import { User } from 'src/modules/users/entities/user.entity';

export interface IConnectedClients {
  socket: Socket;
  user: User;
}
