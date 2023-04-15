import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dtos/new-message.dto';
import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: true })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    this.messagesService.registerClient(client);
    this.clientsUpdated();
  }

  handleDisconnect(client: Socket) {
    this.messagesService.removeClient(client.id);
    this.clientsUpdated();
  }

  @SubscribeMessage('message-client')
  onMessageClient(client: Socket, { message }: MessageDto) {
    const data: MessageDto = {
      fullName: 'Yo',
      message,
    };

    this.wss.emit('message-server', data);
  }

  private clientsUpdated() {
    this.wss.emit(
      'clients-updated',
      this.messagesService.getConnectedClients(),
    );
  }
}
