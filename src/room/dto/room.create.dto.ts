import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoomDto {
	@ApiProperty()
	@IsNotEmpty()
	@Length(3, 25)
	name: string;

	@ApiPropertyOptional()
	@IsOptional()
	@Length(1, 100)
	description?: string;

	@ApiProperty({
		type: String,
		description: 'ObjectId of the User that owns this room',
	})
	@IsNotEmpty()
	owner: Types.ObjectId;
}
