import { Controller, UseGuards } from "@nestjs/common";
import { MessageService } from "./message.service";
import { Message } from "./message.entity";
import { Crud, CrudController, Override, ParsedBody } from "@rewiko/crud";
import { UserRole } from "constants/roles";
import { JwtAuthGuard } from "guards/jwt-auth.guard";
import { RestCrudGuard } from "guards/roles.guard";
import { AuthUser } from "decorators/auth-user.decorator";
import { User } from "modules/user/user.entity";
import { RoomService } from "modules/room/room.service";
import {
  decryptWithPrivatekey,
  encryptWithPrivateKey,
} from "helpers/encryption/keypairgen";

@Crud({
  model: {
    type: Message,
  },
  query: {
    join: {
      room: { eager: true },
      author: { eager: true },
      seenBy: { eager: true },
      parentMessage: { eager: true },
    },
  },
  routes: {
    exclude: ["createManyBase", "replaceOneBase"],
  },
})
@UseGuards(
  JwtAuthGuard,
  new RestCrudGuard({
    "Read-One": [UserRole.USER, UserRole.SUPERADMIN],
    "Read-All": [UserRole.SUPERADMIN],
    "Create-One": [UserRole.USER],
    "Create-Many": [],
    "Update-One": [UserRole.USER, UserRole.SUPERADMIN],
    "Replace-One": [],
    "Delete-One": [UserRole.USER, UserRole.SUPERADMIN],
  })
)
@Controller("message")
export class MessageController implements CrudController<Message> {
  constructor(
    public service: MessageService,
    readonly roomService: RoomService
  ) {}

  @Override()
  async createOne(
    @AuthUser() user: User,
    @ParsedBody() dto: Partial<Message>
  ): Promise<Message> {
    // Decrypt message, using private key of room.
    //and encrypt it with private key of room
    const room = await this.roomService.findOne({
      where: { id: dto.room.id },
      select: ["privateKey", "publicKey"],
    });

    if (dto.body) {
      const msg = decryptWithPrivatekey(Buffer.from(dto.body), room.privateKey);

      dto.body = encryptWithPrivateKey(msg, room.privateKey).toString();
    }

    return this.service.create(user, dto);
  }
}
