import { Injectable } from "@nestjs/common";
import { Room } from "./room.entity";
import { TypeOrmCrudService } from "@rewiko/crud-typeorm";
import { User } from "modules/user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class RoomService extends TypeOrmCrudService<Room> {
  constructor(@InjectRepository(Room) repo) {
    super(repo);
  }

  async create(user: User, room: Partial<Room>): Promise<Room> {
    const data: Partial<Room> = {
      ...room,
      admin: [user],
      members: [...new Set([user, ...room.members])],
    };

    return this.repo.save(this.repo.create(data));
  }
}
