import { IsUUID } from "class-validator";
import { AbstractEntity } from "common/entities/abstract.entity";
import { Room } from "modules/room/room.entity";
import { User } from "modules/user/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";

enum MessageType {
    TEXT = 'text',
    AUDIO = 'audio',
    VIDEO = 'video',
    IMAGE = 'image',
    File = 'file'
}

@Entity()
export class Message  extends AbstractEntity{

    @Column({ type: 'varchar' })
	subject: string;

    @Column({ type: 'varchar' })
	body: string;

    @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
	type: string;

    @Column({
		type: 'timestamp',
	})
    expirationDate: Date;

    @Column({type: 'boolean'})
    deletedByAuthor: boolean;




    /**
	 * Relations
	*/

    @OneToOne(() => Message)
	parentMessage: Message;

    @IsUUID()
    @ManyToOne(() => User)
    author: User

    @IsUUID()
    @ManyToOne(() => Room)
    room: Room

    @OneToMany(() => User, (user: User) => user)
    seenBy: User[]

}
