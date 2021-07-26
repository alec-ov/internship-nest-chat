import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length, IsEmail, IsIn } from 'class-validator';
import { RoleArray, Role } from '../enums/user.role.enum';

export class updateUserDto {
	@ApiProperty({ description: 'New username, from 1 to 25 characters' })
	@IsOptional()
	@Length(1, 25)
	name?: string;

	@ApiProperty()
	@IsOptional()
	@IsEmail()
	email?: string;

	@ApiProperty({
		enum: RoleArray,
		enumName: 'Role',
		description: 'User role, will be used for protected routes',
	})
	@IsOptional()
	@IsIn(RoleArray)
	role?: Role;
}
