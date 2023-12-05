import { Controller, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { Crud, CrudController, Override, ParsedBody } from '@rewiko/crud';
import { UserRole } from 'constants/roles';
import { JwtAuthGuard } from 'guards/jwt-auth.guard';
import { RestCrudGuard } from 'guards/roles.guard';
import { AuthUser } from 'decorators/auth-user.decorator';
import { User } from 'modules/user/user.entity';


@Crud({
	model: {
		type: Message,
	},
  query: {
    join: {
      room: {eager: true},
	  author: {eager: true},
	  seenBy: {eager: true},
	  parentMessage: {eager: true}
	},
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
@Controller('message')
export class MessageController implements CrudController<Message>  {
  constructor(public service: MessageService) {}

  @Override()
	createOne(@AuthUser() user: User, @ParsedBody() dto : Partial<Message>): Promise<Message> {
		return this.service.create(user, dto);
	}

}
