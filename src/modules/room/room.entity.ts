import { AbstractEntity } from "common/entities/abstract.entity";
import { Message } from "modules/message/message.entity";
import { User } from "modules/user/user.entity";
import {
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

@Table
export class Room extends Model<Room> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column
  name: string;

  @Column
  isActive: boolean;

  /**
   * Relations
   */
  @HasMany(() => User, "roomMembers")
  members: User[];

  //@HasMany(() => Message, "roomMessages")
  messages: Message[];

  @HasMany(() => User, "roomAdmin")
  admin: User[];
}
