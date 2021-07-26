import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';

export class UpdateMessageDto {
	@ApiProperty({ description: 'ObjectId string of the message to be updated' })
	@IsNotEmpty()
	@IsObjectId()
	id: Types.ObjectId;

	@ApiProperty()
	@IsDefined()
	text: string;
}
