import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length, IsDateString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';

export class SearchMessageDto {
	@ApiPropertyOptional({
		type: String,
		description:
			'ObjectId of a user that needs to be the author of resulting messages',
	})
	@IsOptional()
	@IsObjectId()
	author?: Types.ObjectId;

	@ApiPropertyOptional({
		type: String,
		description:
			'A string that should be contained inside all resulting messages',
	})
	@IsOptional()
	@Length(2)
	text?: string;

	@ApiPropertyOptional({
		type: String,
		description: 'ISO Date string representing the start of the search period',
	})
	@IsOptional()
	@IsDateString()
	from_date?: Date;

	@ApiPropertyOptional({
		type: String,
		description: 'ISO Date string representing the end of the search period',
	})
	@IsOptional()
	@IsDateString()
	to_date?: Date;
}
