import { IsEmail } from "class-validator";
import { UserRole } from "constants/roles";
import { UserStatus } from "constants/status";
import { generateHash } from "helpers/utils";
import { Exclude } from "class-transformer";
import {
  BeforeCreate,
  Column,
  DataType,
  Default,
  Model,
  Table,
} from "sequelize-typescript";

@Table({
  timestamps: true,
  paranoid: true,
})
export class User extends Model<User> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @IsEmail()
  @Column({ allowNull: false, unique: true })
  email: string;

  @Column({ allowNull: false })
  username: string;

  @Column({ allowNull: false })
  password: string;

  @Default(UserRole.USER)
  @Column(DataType.ENUM(...Object.values(UserRole)))
  role: UserRole;

  @Default(UserStatus.INACTIVE)
  @Column(DataType.ENUM(...Object.values(UserStatus)))
  status: UserStatus;

  @BeforeCreate
  static hashPassword(user: User) {
    console.log("in hash ", user);
    const temp = user.password;
    user.password = generateHash(temp);
    return user;
  }

  /**
   * Relations
   */

  //TODO:
  //@HasMany(() => Room, "userRooms")
  //rooms: Room[];

  //@HasMany(() => Message, "userSentMessages")
  //sentMessages: Message[];
}
