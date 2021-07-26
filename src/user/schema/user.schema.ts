import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types, Document, Schema as mongoSchema } from 'mongoose';
import { Role } from '../enums/user.role.enum';

export type UserDocument = Document & User;

@Schema()
export class User {
	@ApiProperty({ type: String })
	@Prop({ type: mongoSchema.Types.ObjectId, require: true })
	_id: Types.ObjectId;

	@ApiProperty()
	@Prop({ type: String, require: true })
	name: string;

	@ApiPropertyOptional({ type: String })
	@Prop({ type: String, require: true, unique: true })
	email: string;

	@Prop({ type: String, require: true })
	password: string;

	@ApiProperty()
	@Prop({
		type: String,
		enum: ['user', 'admin'],
		require: false,
		default: 'user',
	})
	role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
