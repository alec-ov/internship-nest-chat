import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Types, Document, Schema as mongoSchema } from 'mongoose';

export type Role = 'user' | 'admin';
export type UserDocument = Document & User;

@Schema()
export class User {
	@Prop({ type: mongoSchema.Types.ObjectId, require: true })
	_id: Types.ObjectId;

	@Prop({ type: String, require: true })
	name: string;

	@Prop({ type: String, require: true, unique: true })
	email: string;

	@Prop({ type: String, require: true })
	password: string;

	@Prop({ type: String, require: false, default: 'user' })
	role: Role;
}

export class createUserDto {
	@IsNotEmpty()
	@Length(1, 25)
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@Length(5)
	password: string;

	@IsNotEmpty()
	@IsIn(['user', 'admin'])
	role: Role;
}
export class updateUserDto {
	@IsOptional()
	@Length(1, 25)
	name?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsIn(['user', 'admin'])
	role?: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
