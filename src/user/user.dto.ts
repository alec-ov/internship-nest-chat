import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsEmail, IsIn, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Role, RoleArray } from './user.schema';

const roleOptions = {
	enum: RoleArray,
	enumName: 'Role',
	description: 'User role, will be used for protected routes',
};

export class createUserDto {
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
export class updateUserDto {
	@ApiProperty({ description: 'New username, from 1 to 25 characters' })
	@IsOptional()
	@Length(1, 25)
	name?: string;

	@ApiProperty({ description: 'New email' })
	@IsOptional()
	@IsEmail()
	email?: string;

	@ApiProperty(roleOptions)
	@IsOptional()
	@IsIn(RoleArray)
	role?: Role;
}

// Response DTOs

export class PublicUser {
	@ApiProperty({ type: String })
	_id: Types.ObjectId;

	@ApiProperty()
	name: string;

	@ApiProperty(roleOptions)
	role: Role;
}

export class PrivateUser {
	@ApiProperty({ type: String })
	_id: Types.ObjectId;

	@ApiProperty()
	name: string;

	@ApiProperty({ description: 'User email, private' })
	email: string;

	@ApiProperty({ description: 'Password hash, private' })
	password: string;

	@ApiProperty(roleOptions)
	role: Role;
}
