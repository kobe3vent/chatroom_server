import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Message } from "./message.entity";
import { TypeOrmCrudService } from "@rewiko/crud-typeorm";
import { MESSAGE_REPO } from "constants/repositories";
import { User } from "modules/user/user.entity";

@Injectable()
export class MessageService extends TypeOrmCrudService<Message> {
  constructor(@Inject(MESSAGE_REPO) repo) {
    super(repo);
  }

  async create(user: User, msg: Partial<Message>): Promise<Message> {
    if ((!msg.body && !msg.attachment) || !msg.room)
      throw new BadRequestException("message body || room cant be empty");

    const data: Partial<Message> = {
      ...msg,
      author: user,
    };

    return this.repo.save(data);
  }
}
