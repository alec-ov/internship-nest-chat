import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createUserDto, updateUserDto, User, UserDocument } from './user.model';

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

	async findAll(): Promise<User[]> {
		return this.UserModel.find().lean().exec();
	}

	async addOne(user: createUserDto): Promise<User> {
		const newUser = new this.UserModel(user);
		newUser._id = Types.ObjectId();
		return newUser.save();
	}

	async findOneById(id: string): Promise<User> {
		return this.UserModel.findById(id).lean().exec();
	}

	async findOneByEmail(email: string): Promise<User> {
		return this.UserModel.findOne({ email }).lean().exec();
	}

	async updateOneById(id: string, newUser: updateUserDto): Promise<User> {
		const user: UserDocument = await this.UserModel.findById(id).exec();
		if (newUser.name) user.name = newUser.name;
		if (newUser.email) user.email = newUser.email;
		if (newUser.role) user.role = newUser.role;

		return user.save();
	}

	async deleteOneById(id: string): Promise<User> {
		return this.UserModel.findByIdAndRemove(id).exec();
	}
}
