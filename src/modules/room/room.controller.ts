import { Controller, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.entity';
import { Crud, CrudController, Override, ParsedBody } from '@rewiko/crud';
import { UserRole } from 'constants/roles';
import { RestCrudGuard } from 'guards/roles.guard';
import { JwtAuthGuard } from 'guards/jwt-auth.guard';
import { AuthUser } from 'decorators/auth-user.decorator';
import { User } from 'modules/user/user.entity';


@Crud({
	model: {
		type: Room,
	},
  query: {
    join: {
      members: {
        eager : true,
      },
      messages: {
        eager: true
      },
     
    }
  },
  routes: {
    exclude:['createManyBase', 'replaceOneBase']
  }
})
@UseGuards(
  JwtAuthGuard,
	new RestCrudGuard({
		'Read-One': [UserRole.USER, UserRole.SUPERADMIN],
		'Read-All': [UserRole.SUPERADMIN],
		'Create-One': [UserRole.USER],
		'Create-Many': [],
		'Update-One': [UserRole.USER, UserRole.SUPERADMIN],
		'Replace-One': [],
		'Delete-One': [UserRole.USER, UserRole.SUPERADMIN],
	})
)
@Controller('room')
export class RoomController implements CrudController<Room> {
  constructor(public service: RoomService) {}

  @Override()
	createOne(@AuthUser() user: User, @ParsedBody() dto : Partial<Room>): Promise<Room> {
		return this.service.create(user, dto);
	}
}
