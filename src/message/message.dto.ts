import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsOptional, IsDateString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';
import { PublicUser } from 'src/user/user.dto';
import { Message } from './message.shema';

export class CreateMessageDto {
	@IsNotEmpty()
	@Length(0, 100)
	text: string;

	@IsOptional()
	@IsObjectId()
	forwardOf?: Types.ObjectId;

	@IsNotEmpty()
	@IsObjectId()
	author: Types.ObjectId;

	@IsNotEmpty()
	@IsObjectId()
	room: Types.ObjectId;
}

export class UpdateMessageDto {
	@ApiProperty({ description: 'ObjectId string of the message to be updated' })
	@IsNotEmpty()
	@IsObjectId()
	_id: string;

	@ApiProperty()
	@IsNotEmpty()
	text: string;
}
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

// Response DTOs

class partialMessage {
	@ApiProperty({ type: String })
	_id: Types.ObjectId;

	@ApiProperty()
	text: string;
}

export class UnpopulatedMessage extends partialMessage {
	@ApiProperty({ type: String })
	author: Types.ObjectId;

	@ApiProperty({ type: String })
	room: Types.ObjectId;

	@ApiPropertyOptional({
		type: String,
		description:
			'If defined, this message is a reply to the message with specified ObjectId',
	})
	ForwardOf?: Types.ObjectId;
}

export class PopulatedMessage extends partialMessage {
	@ApiProperty()
	author: PublicUser;

	@ApiProperty({ type: String })
	room: Types.ObjectId;

	@ApiPropertyOptional({
		type: UnpopulatedMessage,
		description: 'If defined, this message is a reply to the specified message',
	})
	ForwardOf?: Message;
}
