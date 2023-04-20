import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { IConnectedClients } from './interfaces/connectedClients.interface';

@Injectable()
export class MessagesService {
  private connectedClients: Record<string, IConnectedClients> = {};

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
    return Object.keys(this.connectedClients);
  }

  getUserName(clientId: string) {
    return this.connectedClients[clientId].user.name;
  }

  private checkUserConnection(userId: string) {
    Object.entries(this.connectedClients).forEach(([, { user, socket }]) => {
      if (user.id !== userId) return;
      socket.disconnect();
    });
  }
}
