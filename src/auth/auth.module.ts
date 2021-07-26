import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { keyStorage } from './keystorage.ts';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: keyStorage.jwt,
			signOptions: { expiresIn: '20m' },
		}),
	],
	providers: [AuthService, JwtStrategy, LocalStrategy],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
