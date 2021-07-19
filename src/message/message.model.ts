import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types, Document } from 'mongoose';
import { Room } from 'src/room/room.model';
import { User } from '../user/user.model';

export type MessageDocument = Document & Message;

@Schema({
	timestamps: { createdAt: 'sent_at', updatedAt: 'edited_at' },
})
export class Message {
	@Prop({ type: Types.ObjectId, require: true })
	_id: Types.ObjectId;

	@Prop({
		type: String,
		require: false,
		default: '',
		index: 'text',
	})
	text: string;

	@Prop({
		type: Types.ObjectId,
		require: true,
		ref: 'User',
	})
	author: User;

	@Prop({
		type: Types.ObjectId,
		require: true,
		ref: 'Room',
	})
	room: Room | Types.ObjectId;

	@Prop({
		type: Types.ObjectId,
		require: false,
		ref: 'Message',
		default: null,
	})
	ForwardOf?: Message;
}

export class createMessageDto {
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
export class updateMessageDto {
	@IsNotEmpty()
	text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
