import { Column, Entity, OneToOne } from "typeorm";
import { AbstractEntity } from "common/entities/abstract.entity";
import { Message } from "modules/message/message.entity";

@Entity()
export class File extends AbstractEntity {
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
