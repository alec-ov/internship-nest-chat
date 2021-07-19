import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { createUserDto, updateUserDto } from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('/')
	async findAll() {
		return { data: await this.userService.findAll() };
	}

	@Get('/id/:id')
	async findById(@Param('id') id: string) {
		return {
			data: await this.userService.findOneById(id),
		};
	}

	@Get('/email/:email')
	async findByEmail(@Param('email') email: string) {
		return { data: await this.userService.findOneByEmail(email) };
	}

	@Post('/')
	async createOne(@Body() user: createUserDto) {
		return { data: await this.userService.addOne(user) };
	}

	@Patch('/id/:id')
	async updateOne(@Param('id') id: string, @Body() newUser: updateUserDto) {
		return {
			data: await this.userService.updateOneById(id, newUser),
		};
	}

	@Delete('/id/:id')
	async deleteOne(@Param('id') id: string) {
		return {
			data: await this.userService.deleteOneById(id),
		};
	}
}
