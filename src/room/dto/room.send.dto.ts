import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';

export class SendMessageDto {
	@ApiProperty()
	@IsNotEmpty()
	text: string;

	@ApiPropertyOptional({
		type: String,
		description:
			'An ObjectId of another message, if defined, thus message is a "reply" to that message',
	})
	@IsOptional()
	@IsObjectId()
	forwardOf?: Types.ObjectId;

	@ApiProperty({
		type: String,
		description: 'An ObjectId of the User that sent this message',
	})
	@IsNotEmpty()
	@IsObjectId()
	author: Types.ObjectId;
}
