import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types, Document, Schema as mongoSchema } from 'mongoose';
import { User } from 'src/user/user.model';

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

export class createRoomDto {
	@IsNotEmpty()
	@Length(3, 25)
	name: string;

	@IsOptional()
	@Length(1, 100)
	description?: string;

	@IsNotEmpty()
	owner: Types.ObjectId;
}
export class updateRoomDto {
	@IsOptional()
	@Length(3, 25)
	name?: string;

	@IsOptional()
	@Length(1, 100)
	description?: string;

	@IsOptional()
	@Length(1, 100)
	owner?: Types.ObjectId;
}

export class sendMessageDto {
	@IsNotEmpty()
	text: string;

	@IsOptional()
	@IsObjectId()
	forwardOf?: Types.ObjectId;

	@IsNotEmpty()
	@IsObjectId()
	author: Types.ObjectId;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
