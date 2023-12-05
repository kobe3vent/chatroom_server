import { UseGuards } from "@nestjs/common";
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from "@nestjs/websockets";
import { SEND_MESSAGE, NOTIFY_NEW_ROOM } from "constants/misc";
import { WsGuard } from "guards/socket.guard";
import { Message } from "modules/message/message.entity";
import { Room } from "modules/room/room.entity";
import { Server, Socket } from "socket.io";

@UseGuards(WsGuard)
@WebSocketGateway(81, {
  transports: ["polling"],
  cors: {
    origin: "*",
  },
})
export class SocketGateway {
  private roomsOnline = new Map();

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(SEND_MESSAGE)
  sendMessageToRoom(
    @MessageBody() msg: Message,
    @ConnectedSocket() client: Socket
  ): void {
    console.log("msg: ", msg);
    this.server.emit(`${msg.room.id}`, msg);
  }

  @SubscribeMessage(NOTIFY_NEW_ROOM)
  newChatRoom(
    @MessageBody() room: Room,
    @ConnectedSocket() client: Socket
  ): void {
    console.log("room: : ", room);

    room.members.every((member) => this.server.emit(member.id, room));
  }
}
