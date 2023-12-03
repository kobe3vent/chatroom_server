import { IsNotEmpty } from "class-validator";
import { AbstractEntity } from "common/entities/abstract.entity";
import { File } from "modules/file/entities/file.entity";
import { Room } from "modules/room/room.entity";
import { User } from "modules/user/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from "typeorm";

export enum MessageType {
  TEXT = "text",
  AUDIO = "audio",
  VIDEO = "video",
  IMAGE = "image",
  File = "file",
}

@Entity()
export class Message extends AbstractEntity {
  @Column({ type: "varchar", nullable: true })
  subject: string;

  @IsNotEmpty()
  @Column({ type: "varchar" })
  body: string;

  @Column({ type: "enum", enum: MessageType, default: MessageType.TEXT })
  type: string;

  @Column({
    type: "timestamp",
    default: null,
  })
  expirationDate: Date;

  @Column({ type: "boolean", default: false })
  deletedByAuthor: boolean;

  /**
   * Relations
   */

  @OneToOne(() => Message)
  @JoinColumn()
  parentMessage: Message;

  @ManyToOne(() => User, (user: User) => user.sentMessages)
  author: User;

  @ManyToOne(() => Room, (room: Room) => room.messages)
  room: Room;

  @ManyToMany(() => User)
  @JoinTable()
  seenBy: User[];

  @OneToOne(() => File)
  @JoinColumn()
  attachment: File;
}
