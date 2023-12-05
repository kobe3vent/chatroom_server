import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { RoomService } from "./room.service";
import { Room } from "./room.entity";
import { Crud, CrudController, Override, ParsedBody } from "@rewiko/crud";
import { UserRole } from "constants/roles";
import { RestCrudGuard } from "guards/roles.guard";
import { JwtAuthGuard } from "guards/jwt-auth.guard";
import { AuthUser } from "decorators/auth-user.decorator";
import { User } from "modules/user/user.entity";

@Crud({
  model: {
    type: Room,
  },
  query: {
    join: {
      members: {
        eager: true,
      },
      messages: {
        eager: true,
      },
      admin: {
        eager: true,
      },
    },
  },
  routes: {
    exclude: ["createManyBase", "replaceOneBase"],
  },
})
@UseGuards(
  JwtAuthGuard,
  new RestCrudGuard({
    "Read-One": [],
    "Read-All": [],
    "Create-One": [UserRole.USER],
    "Create-Many": [],
    "Update-One": [],
    "Replace-One": [],
    "Delete-One": [],
  })
)
@Controller("room")
export class RoomController implements CrudController<Room> {
  constructor(public service: RoomService) {}

  @Override()
  createOne(
    @AuthUser() user: User,
    @ParsedBody() dto: Partial<Room>
  ): Promise<Room> {
    return this.service.create(user, dto);
  }

  @Get("details/:id")
  async getRoomDetails(@Param("id") roomID: string, @AuthUser() user: User) {
    const room = await this.service.findOne({
      where: { id: roomID },
      relations: ["messages.author", "members", "admin", "messages.attachment"],
    });
    if (!room) throw new NotFoundException(`room: ${roomID} couldnt be found`);
    const userIsAmember = room.members.find((member) => member.id === user.id);

    if (!userIsAmember) throw new ForbiddenException("You dont belong here");

    //sort messages in ASC order
    room.messages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return room;
  }
}
