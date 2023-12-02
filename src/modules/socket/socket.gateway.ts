import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Message } from 'modules/message/message.entity';
import { Room } from 'modules/room/room.entity';
import { Server, Socket } from 'socket.io';


@WebSocketGateway(81, {transports: ['polling'], cors: {
    origin: "*",
  },
})
export class SocketGateway  {

  private roomsOnline = new Map()

  @WebSocketServer()
  server: Server;


  @SubscribeMessage('sendMsgToSever')
  sendMessageToRoom(@MessageBody() msg: Message,  @ConnectedSocket() client: Socket): void {
    //TODO: Validate input;
    console.log('msg: ', msg)
    this.server.emit(`${msg.room.id}`, msg)

  }

  @SubscribeMessage('newRoom')
  newChatRoom(@MessageBody() room: Room,  @ConnectedSocket() client: Socket): void{
    this.server.emit('newRoom', room)
   // return {event: 'newRoom', data: msg};
  }
}
