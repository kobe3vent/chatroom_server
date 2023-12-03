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
  @Column
  @IsEmail()
  email: string;

  @Column
  username: string;

  @Exclude()
  @Column
  password: string;

  @Column(DataType.ENUM(...Object.values(UserRole)))
  @Default(UserRole.USER)
  role: UserRole;

  @Column(DataType.ENUM(...Object.values(UserStatus)))
  @Default(UserStatus.INACTIVE)
  status: UserStatus;

  @BeforeCreate
  async hashPassword(): Promise<void> {
    this.password = generateHash(this.password);
  }

  /**
   * Relations
   */

  @HasMany(() => Model<Room>)
  rooms: Room[];

  @HasMany(() => Model<Message>)
  sentMessages: Message[];
}
