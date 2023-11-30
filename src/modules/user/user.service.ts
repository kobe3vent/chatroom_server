import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';
import { User } from './user.entity';
import { USER_REPO } from 'constants/repositories';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(@Inject(USER_REPO) repo) {
		super(repo);
	}

}
