import { Column, Entity, OneToOne } from "typeorm";
import { AbstractEntity } from "common/entities/abstract.entity";
import { Message } from "modules/message/message.entity";
import { Exclude } from "class-transformer";

@Entity()
export class File extends AbstractEntity {
  @Exclude()
  @Column({ type: "varchar" })
  key: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column()
  contentType!: string;

  //relations
  @OneToOne(() => Message)
  message: Message;
}
