import { BeforeInsert, Column, Entity, ManyToMany, OneToMany} from 'typeorm';
import { AbstractEntity } from 'common/entities/abstract.entity';
import { IsEmail, IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { UserRole } from 'constants/roles';
import { UserStatus } from 'constants/status';
import { generateHash } from 'helpers/utils';
import { Room } from 'modules/room/room.entity';

const { UPDATE } = CrudValidationGroups;
@Entity()
export class User extends AbstractEntity {
	@Column({ unique: true, type: 'varchar'})
	@IsEmail()
	@IsOptional({ groups: [UPDATE] })
	email: string;

	@Column({ type: 'varchar', unique: true })
	username: string;

	@Column({ type: 'varchar'})
	password: string;

	@Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
	role: UserRole;

	@Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
	status: UserStatus;

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        this.password = generateHash(this.password);
    }
	

	/**
	 * Relations
	*/

	@ManyToMany(() => Room, (room: Room) => room.members, {
		cascade: true,
	})
	rooms: Room[];
	

}
