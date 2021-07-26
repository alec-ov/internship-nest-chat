import { IsNotEmpty, Length, IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';

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
