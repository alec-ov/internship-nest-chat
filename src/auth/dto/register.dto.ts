import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsEmail, IsIn } from 'class-validator';

import { RoleArray, Role } from 'src/user/enums/user.role.enum';

const roleOptions = {
	enum: RoleArray,
	enumName: 'Role',
	description: 'User role, will be used for protected routes',
};

export class registerUserDto {
	@ApiProperty({ description: 'Username, from 1 to 25 characters' })
	@IsNotEmpty()
	@Length(1, 25)
	name: string;

	@ApiProperty({
		description: 'A valid email. Should be unique for every User',
	})
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({ description: 'A password, miminum 5 chars, will be hashed' })
	@IsNotEmpty()
	@Length(5)
	password: string;

	@ApiProperty(roleOptions)
	@IsNotEmpty()
	@IsIn(RoleArray)
	role: Role;
}
