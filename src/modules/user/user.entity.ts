import { AbstractEntity } from "common/entities/abstract.entity";
import { IsEmail } from "class-validator";
import { UserRole } from "constants/roles";
import { UserStatus } from "constants/status";
import { generateHash } from "helpers/utils";
import { Room } from "modules/room/room.entity";
import { Message } from "modules/message/message.entity";
import { Exclude } from "class-transformer";
import {
  BeforeCreate,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";

@Table
export class User extends AbstractEntity {
  @IsEmail()
  @Column
  email: string;

  @Column
  username: string;

  @Exclude()
  @Column
  password: string;

  @Default(UserRole.USER)
  @Column(DataType.ENUM(...Object.values(UserRole)))
  role: UserRole;

  @Default(UserStatus.INACTIVE)
  @Column(DataType.ENUM(...Object.values(UserStatus)))
  status: UserStatus;

  @BeforeCreate
  static hashPassword(user: User) {
    const temp = user.password;
    user.password = generateHash(temp);
  }

  /**
   * Relations
   */

  @HasMany(() => Model<Room>)
  rooms: Room[];

  @HasMany(() => Model<Message>)
  sentMessages: Message[];
}
