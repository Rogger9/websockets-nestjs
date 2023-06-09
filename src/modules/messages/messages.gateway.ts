import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '../auth/interfaces/payload.interface';
import { MessageDto } from './dtos/new-message.dto';
import { IMessage } from './interfaces';
import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: true })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    try {
      const { id } = this.jwtService.verify<JwtPayload>(token);
      await this.messagesService.registerClient(client, id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.clientsUpdated();
    const message = this.messagesService.notify('join', client.id);
    this.emitMessage(message);
  }

  handleDisconnect(client: Socket) {
    const message = this.messagesService.notify('disconnect', client.id);
    this.emitMessage(message);
    this.messagesService.removeClient(client.id);
    this.clientsUpdated();
  }

  @SubscribeMessage('message-client')
  onMessageClient(client: Socket, { message }: MessageDto) {
    const data: MessageDto = {
      fullName: this.messagesService.getUserName(client.id),
      message,
    };

    this.emitMessage(data);
  }

  emitMessage(data: IMessage) {
    return this.wss.emit('message-server', data);
  }

  private clientsUpdated() {
    this.wss.emit(
      'clients-updated',
      this.messagesService.getConnectedClients(),
    );
  }
}
