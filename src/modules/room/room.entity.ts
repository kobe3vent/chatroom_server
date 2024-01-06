import { Exclude } from "class-transformer";
import { IsString } from "class-validator";
import { AbstractEntity } from "common/entities/abstract.entity";
import { generatePrivatePublicKeys } from "helpers/encryption/keypairgen";
import { Message } from "modules/message/message.entity";
import { User } from "modules/user/user.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  BeforeInsert,
} from "typeorm";

@Entity()
export class Room extends AbstractEntity {
  @IsString()
  @Column({ type: "text" })
  name: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @Column({ type: "text" })
  publicKey: string;

  @Exclude()
  @Column({ type: "text" })
  privateKey: string;

  //HOOK
  @BeforeInsert()
  async generateKeyPairs(): Promise<void> {
    const { publicKey, privateKey } = await generatePrivatePublicKeys();
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

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
