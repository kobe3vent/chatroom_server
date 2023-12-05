import { IsString } from "class-validator";
import { AbstractEntity } from "common/entities/abstract.entity";
import { Message } from "modules/message/message.entity";
import { User } from "modules/user/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

@Entity()
export class Room extends AbstractEntity {
  @IsString()
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  /**
   * Relations
   */
  @ManyToMany(() => User, (user: User) => user.rooms)
  @JoinTable()
  members: User[];

  @OneToMany(() => Message, (message: Message) => message.room)
  messages: Message[];

  @ManyToMany(() => User)
  @JoinTable()
  admin: User[];
}
