import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PublicUser } from 'src/user/dto/user.public.dto';

import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';

import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private jwtService: JwtService,
	) {}

	// Checks user sign in data
	async validateUser(
		email: string,
		password: string,
	): Promise<Omit<User, 'password'> | null> {
		const user = await this.userService.findOneByEmail(email);
		if (!user) return null;

		const check = await bcrypt.compare(password, user.password);
		if (check) {
			delete user.password;
			return user;
		}
		return null;
	}

	// Issues tokens for a User object
	async login(user: PublicUser) {
		const payload = { user, sub: user._id };
		return {
			access_token: this.jwtService.sign(payload, { expiresIn: '10m' }),
			refresh_token: this.jwtService.sign(payload, { expiresIn: '2d' }),
		};
	}

	async checkToken(token): Promise<false | PublicUser> {
		try {
			const { sub } = this.jwtService.verify(token);
			if (sub) {
				const currentUser = await this.userService.findOneById(sub);
				delete currentUser.email;
				delete currentUser.password;

				if (currentUser) return currentUser;
			}
		} catch (e) {
			if (e instanceof JsonWebTokenError) {
				return false;
			} else throw e;
		}
		return false;
	}
}
