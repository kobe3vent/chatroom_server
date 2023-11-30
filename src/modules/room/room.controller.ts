import { Controller, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.entity';
import { Crud, CrudController } from '@nestjsx/crud';
import { UserRole } from 'constants/roles';
import { RestCrudGuard } from 'guards/roles.guard';
import { JwtAuthGuard } from 'guards/jwt-auth.guard';


@Crud({
	model: {
		type: Room,
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
}
