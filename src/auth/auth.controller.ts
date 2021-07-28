import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { PrivateUser } from 'src/user/dto/user.private.dto';

import { Role } from 'src/user/enums/user.role.enum';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { loginUserDto } from './dto/login.dto';
import { registerUserDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@Post('/login')
	@UseGuards(LocalAuthGuard)
	@ApiBody({ type: loginUserDto })
	async login(@Request() { user }) {
		return this.authService.login(user);
	}

	@Post('/register')
	@ApiOperation({ description: 'Create a new user' })
	@ApiBody({
		type: registerUserDto,
		description: 'The user to be created',
	})
	@ApiCreatedResponse({
		status: 201,
		type: PrivateUser,
		description: 'The new User document',
	})
	async register(@Body() newUser: registerUserDto) {
		newUser.role = Role.User;
		const user = await this.userService.addOne(newUser);
		return this.authService.login(user);
	}

	@Post('/self')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ description: 'Returns current authenticated user' })
	async private(@Request() { user }: { user: PrivateUser }) {
		return await this.userService.findOneById(user._id);
	}
}
