import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { IConnectedClients, IMessage, TypeNotify } from './interfaces';

@Injectable()
export class MessagesService {
  private connectedClients: Record<string, IConnectedClients> = {};
  private readonly botName = 'Bot';

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');

    this.checkUserConnection(user.id);

    this.connectedClients[client.id] = { socket: client, user };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.values(this.connectedClients).map(({ user }) => user.name);
  }

  getUserName(clientId: string) {
    return this.connectedClients[clientId].user.name;
  }

  notify(type: TypeNotify, clientId: string) {
    const { user } = this.connectedClients[clientId];
    const discMessage: IMessage = {
      fullName: this.botName,
      message: `User ${user.name} has disconnected`,
    };
    const joinMessage: IMessage = {
      fullName: this.botName,
      message: `User ${user.name} has joined the chat`,
    };
    const msg = type === 'join' ? joinMessage : discMessage;

    return msg;
  }

  private checkUserConnection(userId: string) {
    Object.entries(this.connectedClients).forEach(([, { user, socket }]) => {
      if (user.id !== userId) return;
      socket.disconnect();
    });
  }
}
