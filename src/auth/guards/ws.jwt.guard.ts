import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';

import { AuthService } from '../auth.service';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly authService: AuthService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const tokens = context.switchToWs().getData().authorization;
		if (tokens) {
			const user = await this.authService.checkToken(tokens.access_token);
			if (user) {
				context.switchToWs().getData().user = user;
				return true;
			}
		}
		Logger.warn('unauthorized:' + tokens.access_token);
		throw new WsException('unauthorized');
	}
}
