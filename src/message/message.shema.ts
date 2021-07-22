import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Room } from 'src/room/room.schema';
import { User } from '../user/user.schema';

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

export const MessageSchema = SchemaFactory.createForClass(Message);
