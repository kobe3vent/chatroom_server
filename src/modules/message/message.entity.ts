import { IsNotEmpty } from "class-validator";
import { AbstractEntity } from "common/entities/abstract.entity";
import { File } from "modules/file/file.entity";
import { Room } from "modules/room/room.entity";
import { User } from "modules/user/user.entity";
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  HasMany,
  HasOne,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

export enum MessageType {
  TEXT = "text",
  AUDIO = "audio",
  VIDEO = "video",
  IMAGE = "image",
  File = "file",
}

@Table
export class Message extends Model<Message> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

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

  @BelongsTo(() => Message, "parentID")
  parentMessage: Message;
  @HasOne(() => User, "messageAuthor")
  author: User;

  @HasOne(() => Room, "messageRoom")
  room: Room;

  @HasMany(() => User, "messageSeenBy")
  seenBy: User[];

  @HasOne(() => File, "messageAttachment")
  attachment: File;
}
