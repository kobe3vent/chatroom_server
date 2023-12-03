import { AbstractEntity } from "common/entities/abstract.entity";
import { Message } from "modules/message/message.entity";
import { Exclude } from "class-transformer";
import { Column, HasOne, Model, Table } from "sequelize-typescript";

@Table
export class File extends AbstractEntity {
  @Exclude()
  @Column
  key: string;

  @Column
  name!: string;

  @Column
  contentType!: string;

  //relations
  @HasOne(() => Model<Message>)
  message: Message;
}
