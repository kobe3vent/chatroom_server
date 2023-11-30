import { IsNotEmpty, IsUUID } from "class-validator";
import { AbstractEntity } from "common/entities/abstract.entity";
import { Room } from "modules/room/room.entity";
import { User } from "modules/user/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";

export enum MessageType {
    TEXT = 'text',
    AUDIO = 'audio',
    VIDEO = 'video',
    IMAGE = 'image',
    File = 'file'
}

@Entity()
export class Message  extends AbstractEntity {

    @Column({ type: 'varchar' })
	subject: string;

    @IsNotEmpty()
    @Column({ type: 'varchar' })
	body: string;

    @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
	type: string;

    @Column({
		type: 'timestamp',
        default: null
	})
    expirationDate: Date;

    @Column({type: 'boolean', default: false})
    deletedByAuthor: boolean;


    /**
	 * Relations
	*/

    @IsUUID()
    @ManyToOne(() => Message)
	parentMessage: Message;

    @IsUUID()
    @ManyToOne(() => User, (user: User) => user.sentMessages)
    author: User

    @IsUUID()
    @ManyToOne(() => Room , (room: Room) => room.messages)
    room: Room

    @OneToMany(() => User, (user: User) => user)
    seenBy: User[]

}
