import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schema/user.schema';
import { updateUserDto } from './dto/user.update.dto';
import { registerUserDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

	async findAll(): Promise<User[]> {
		return this.UserModel.find().lean().exec();
	}

	async addOne(user: registerUserDto): Promise<User> {
		const newUser = new this.UserModel(user);
		newUser._id = Types.ObjectId();
		newUser.password = await bcrypt.hash(user.password, 13);
		return newUser.save();
	}

	async findOneById(id: Types.ObjectId): Promise<User> {
		return this.UserModel.findById(id).select('+password +email').lean().exec();
	}

	async findOneByEmail(email: string): Promise<User> {
		return this.UserModel.findOne({ email })
			.select('+password +email') // include "private" data
			.lean()
			.exec();
	}

	async updateOneById(
		id: Types.ObjectId,
		newUser: updateUserDto,
	): Promise<User> {
		const user: UserDocument = await this.UserModel.findById(id)
			.select('+email')
			.exec();
		if (newUser.name) user.name = newUser.name;
		if (newUser.email) user.email = newUser.email;
		if (newUser.role) user.role = newUser.role;

		return user.save();
	}

	async deleteOneById(id: Types.ObjectId): Promise<User> {
		return this.UserModel.findByIdAndRemove(id).exec();
	}
}
