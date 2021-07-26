import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateRoomDto {
	@ApiPropertyOptional()
	@IsOptional()
	@Length(3, 25)
	name?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@Length(1, 100)
	description?: string;

	@ApiPropertyOptional({
		type: String,
		description:
			'An ObjectId of the User that will be the new owner of this room',
	})
	@IsOptional()
	@Length(1, 100)
	owner?: Types.ObjectId;
}
