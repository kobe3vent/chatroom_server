import { BadRequestException, Injectable } from "@nestjs/common";
import { Message } from "./message.entity";
import { TypeOrmCrudService } from "@rewiko/crud-typeorm";
import { User } from "modules/user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class MessageService extends TypeOrmCrudService<Message> {
  constructor(@InjectRepository(Message) repo) {
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
