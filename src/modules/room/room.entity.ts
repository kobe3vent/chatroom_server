import { AbstractEntity } from "common/entities/abstract.entity";
import { Message } from "modules/message/message.entity";
import { User } from "modules/user/user.entity";
import { Column, HasMany, Model, Table } from "sequelize-typescript";

@Table
export class Room extends AbstractEntity {
  @Column
  name: string;

  @Column
  isActive: boolean;

  /**
   * Relations
   */
  @HasMany(() => Model<User>)
  members: User[];

  @HasMany(() => Model<Message>)
  messages: Message[];

  @HasMany(() => Model<User>)
  admin: User[];
}
