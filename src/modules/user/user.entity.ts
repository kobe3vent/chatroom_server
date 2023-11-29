import { BeforeInsert, Column, Entity} from 'typeorm';
import { AbstractEntity } from 'common/entities/abstract.entity';
import { IsEmail, IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { UserRole } from 'constants/roles';
import { UserStatus } from 'constants/status';
import { generateHash } from 'utils';

const { UPDATE } = CrudValidationGroups;
@Entity()
export class User extends AbstractEntity {
	@Column({ unique: true, type: 'text' })
	@IsEmail()
	@IsOptional({ groups: [UPDATE] })
	email: string;

	@Column({ type: 'text' })
	username: string;

	@Column({ type: 'text' })
	password: string;

	@Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
	role: UserRole;

	@Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
	status: UserStatus;

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        this.password = generateHash(this.password);
    }

}
