import { Inject, Injectable } from "@nestjs/common";
import { Room } from "./room.entity";
import { TypeOrmCrudService } from "@rewiko/crud-typeorm";
import { ROOM_REPO } from "constants/repositories";
import { User } from "modules/user/user.entity";

@Injectable()
export class RoomService extends TypeOrmCrudService<Room> {
  constructor(@Inject(ROOM_REPO) repo) {
    super(repo);
  }

  async create(user: User, room: Partial<Room>): Promise<Room> {
    const data: Partial<Room> = {
      ...room,
      admin: [user],
      members: [...new Set([user, ...room.members])],
    };

    return this.repo.save(data);
  }
}
