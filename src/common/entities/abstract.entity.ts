import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractEntity {
	@PrimaryGeneratedColumn('uuid')
	uuid: string;

	// @Exclude()
	@CreateDateColumn({
		type: 'timestamp with time zone',
	})
	createdAt: Date;

	// @Exclude()
	@UpdateDateColumn({
		type: 'timestamp with time zone',
	})
	updatedAt: Date;
}
