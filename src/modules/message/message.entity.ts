import { IsNotEmpty } from "class-validator";
import { AbstractEntity } from "common/entities/abstract.entity";
import { File } from "modules/file/file.entity";
import { Room } from "modules/room/room.entity";
import { User } from "modules/user/user.entity";
import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";

export enum MessageType {
  TEXT = "text",
  AUDIO = "audio",
  VIDEO = "video",
  IMAGE = "image",
  File = "file",
}

@Table
export class Message extends AbstractEntity {
  @Column
  subject: string;

  @IsNotEmpty()
  @Column
  body: string;

  @Column
  type: string;

  @Column(DataType.DATE)
  expirationDate: Date;

  @Column
  deletedByAuthor: boolean;

  /**
   * Relations
   */

  @HasOne(() => Model<Message>)
  parentMessage: Message;

  @HasOne(() => Model<User>)
  author: User;

  @HasOne(() => Model<Room>)
  room: Room;

  @HasMany(() => Model<User>)
  seenBy: User[];

  @HasOne(() => Model<File>)
  attachment: File;
}
