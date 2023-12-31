import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRole } from 'constants/roles';

export const Roles = (...roles: UserRole[]): CustomDecorator<string> =>
	SetMetadata('roles', roles);
