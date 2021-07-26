import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { Role, RoleArray } from '../enums/user.role.enum';

export class PublicUser {
	@ApiProperty({ type: String })
	_id: Types.ObjectId;

	@ApiProperty()
	name: string;

	@ApiProperty({
		enum: RoleArray,
		enumName: 'Role',
		description: 'User role, will be used for protected routes',
	})
	role: Role;
}
