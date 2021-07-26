import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document, Schema as mongoSchema } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

export type RoomDocument = Document & Room;

@Schema()
export class Room {
	@Prop({ type: mongoSchema.Types.ObjectId, require: true })
	_id: Types.ObjectId;

	@Prop({ type: String, require: true })
	name: string;

	@Prop({ type: String, require: false, default: '' })
	description: string;

	@Prop({ type: [{ type: mongoSchema.Types.ObjectId, ref: 'User' }] })
	users: User[];

	@Prop({ type: mongoSchema.Types.ObjectId, ref: 'User', require: true })
	owner: User;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
