import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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

  private clientsUpdated() {
    this.wss.emit(
      'clients-updated',
      this.messagesService.getConnectedClients(),
    );
  }
}
