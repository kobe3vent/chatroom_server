import { AbstractEntity } from "common/entities/abstract.entity";
import { Message } from "modules/message/message.entity";
import { User } from "modules/user/user.entity";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";

@Entity()
export class Room extends AbstractEntity {

    @Column({ type: 'varchar' })
	name: string;

    @Column({ type: 'boolean', default: true })
	isActive: boolean;

    @ManyToMany(() => User)
    admin: User[]
    
    /**
	 * Relations
	*/
    @ManyToMany(() => User)
    members:User[];

    @OneToMany(() => Message, (message: Message) => message.room, { onDelete: 'CASCADE', eager: true })
    messages:Message[];
}