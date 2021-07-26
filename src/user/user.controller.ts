import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { PrivateUser } from './dto/user.private.dto';
import { PublicUser } from './dto/user.public.dto';
import { updateUserDto } from './dto/user.update.dto';

import { User } from './schema/user.schema';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('/')
	@ApiResponse({
		status: 200,
		type: [PublicUser],
		description: 'An array of all users',
	})
	async findAll() {
		return await this.userService.findAll();
	}

	@Get('/id/:id')
	@ApiResponse({
		status: 200,
		type: PrivateUser,
		description: 'One user with the specified id',
	})
	async findById(@Param('id') id: Types.ObjectId) {
		return await this.userService.findOneById(id);
	}

	@ApiResponse({
		status: 200,
		type: User,
		description: 'One user with the specified email',
	})
	@Get('/email/:email')
	@ApiResponse({
		status: 200,
		type: PrivateUser,
		description: 'The new User document',
	})
	async findByEmail(@Param('email') email: string) {
		return await this.userService.findOneByEmail(email);
	}

	@Patch('/id/:id')
	@ApiOperation({ description: 'Update a user' })
	@ApiBody({
		type: updateUserDto,
		description: 'Partial User object with fields to be updated',
	})
	@ApiResponse({
		status: 200,
		type: PrivateUser,
		description: 'The new User document',
	})
	async updateOne(
		@Param('id') id: Types.ObjectId,
		@Body() newUser: updateUserDto,
	) {
		return {
			data: await this.userService.updateOneById(id, newUser),
		};
	}

	@ApiOperation({ description: 'Delete a user' })
	@ApiResponse({
		status: 200,
		type: PrivateUser,
		description: 'The deleted User document',
	})
	@Delete('/id/:id')
	async deleteOne(@Param('id') id: Types.ObjectId) {
		return {
			data: await this.userService.deleteOneById(id),
		};
	}
}
