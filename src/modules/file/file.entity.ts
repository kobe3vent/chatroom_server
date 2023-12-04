import { AbstractEntity } from "common/entities/abstract.entity";
import { Message } from "modules/message/message.entity";
import { Exclude } from "class-transformer";
import {
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  HasOne,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

@Table
export class File extends Model<File> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Exclude()
  @Column
  key: string;

  @Column
  name!: string;

  @Column
  contentType!: string;

  //relations
  //@HasOne(() => Message, "fileMessage")
  message: Message;
}
