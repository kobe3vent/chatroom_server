import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Message } from 'modules/message/message.entity';
import { Room } from 'modules/room/room.entity';
import { Server, Socket } from 'socket.io';


@WebSocketGateway(81, {transports: ['websocket'], cors: {
    origin: '*',
  },
})
export class SocketGateway  {

  private roomsOnline = new Map()

  @WebSocketServer()
  server: Server;

  //Use redis to keep track off online status
  //when user logs in, you store his id with a timestamp
  // any messages, sent you update timestamp.
  // if timestamp is older than 10 mins offline.

  @SubscribeMessage('sendMsgToSever')
  sendMessageToRoom(@MessageBody() msg: Message,  @ConnectedSocket() client: Socket): void {
    const roomSocketId = this.roomsOnline.get(msg.room.id)
    if(!roomSocketId) this.roomsOnline.set(msg.room.id, client.id)


    this.server.to(roomSocketId || client.id ).emit('sendMsgToServer', msg)
   // return {event: 'newMessage', data: msg};
  }

  @SubscribeMessage('newRoom')
  newChatRoom(@MessageBody() room: Room,  @ConnectedSocket() client: Socket): void{
    this.server.emit('newRoom', room)
   // return {event: 'newRoom', data: msg};
  }
}
