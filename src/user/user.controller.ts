import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import {
	createUserDto,
	PrivateUser,
	PublicUser,
	updateUserDto,
} from './user.dto';
import { User } from './user.schema';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
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
	async findById(@Param('id') id: string) {
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

	@Post('/')
	@ApiOperation({ description: 'Create a new user' })
	@ApiBody({
		type: createUserDto,
		description: 'The user to be created',
	})
	@ApiCreatedResponse({
		status: 201,
		type: PrivateUser,
		description: 'The new User document',
	})
	async createOne(@Body() user: createUserDto) {
		return { data: await this.userService.addOne(user) };
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
	async updateOne(@Param('id') id: string, @Body() newUser: updateUserDto) {
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
	async deleteOne(@Param('id') id: string) {
		return {
			data: await this.userService.deleteOneById(id),
		};
	}
}
