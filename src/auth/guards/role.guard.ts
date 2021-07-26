import {
	CanActivate,
	ExecutionContext,
	Injectable,
	SetMetadata,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';
import { PrivateUser } from 'src/user/dto/user.private.dto';
import { Role } from 'src/user/enums/user.role.enum';

@Injectable()
export class RoleAuthGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const user: PrivateUser = context.switchToHttp().getRequest().user;

		const roles: Role[] = this.reflector.get<Role[]>(
			'roles',
			context.getHandler(),
		);

		if (!roles) {
			return true;
		}

		if (RoleAuthGuard.matchRoles(roles, user.role)) {
			return true;
		}
		throw new UnauthorizedException(`User required to be ${roles.join(', ')}`);
	}

	static matchRoles(roles: Role[], userRole: Role): boolean {
		return roles.includes(userRole);
	}
}

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
