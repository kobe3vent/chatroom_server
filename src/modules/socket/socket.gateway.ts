import { UseGuards } from "@nestjs/common";
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from "@nestjs/websockets";
import { JwtAuthGuard } from "guards/jwt-auth.guard";
import { Message } from "modules/message/message.entity";
import { Room } from "modules/room/room.entity";
import { Server, Socket } from "socket.io";

//TODO: implement token auth for sokets
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

  @SubscribeMessage("sendMessageToRoom")
  sendMessageToRoom(
    @MessageBody() msg: Message,
    @ConnectedSocket() client: Socket
  ): void {
    console.log("msg: ", msg);
    this.server.emit(`${msg.room.id}`, msg);
  }

  //TODO: alert on new Rooms created
  @SubscribeMessage("newRoom")
  newChatRoom(
    @MessageBody() room: Room,
    @ConnectedSocket() client: Socket
  ): void {
    this.server.emit("newRoom", room);
  }
}
