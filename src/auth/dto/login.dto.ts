import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsEmail } from 'class-validator';

export class loginUserDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	@Length(5)
	password: string;
}
