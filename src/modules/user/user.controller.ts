import { Controller, UseGuards, } from '@nestjs/common';
import { UserService } from './user.service';
import { Crud, CrudController } from '@rewiko/crud';
import { User } from './user.entity';
import { RestCrudGuard } from 'guards/roles.guard';
import { UserRole } from 'constants/roles';

@Crud({
	model: {
		type: User,
	},
  routes: {
    exclude:['createManyBase', 'replaceOneBase']
  }
})
@UseGuards(
	new RestCrudGuard({
		'Read-One': [UserRole.SUPERADMIN],
		'Read-All': [UserRole.SUPERADMIN],
		'Create-One': [UserRole.ALL],
		'Create-Many': [],
		'Update-One': [UserRole.USER, UserRole.SUPERADMIN],
		'Replace-One': [],
		'Delete-One': [UserRole.USER, UserRole.SUPERADMIN],
	})
)
@Controller('user')
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}


}

//TODO: implement overide PATCH && DELETE route to only allow user to patch his object