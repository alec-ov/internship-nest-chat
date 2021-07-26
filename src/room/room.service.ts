import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRoomDto } from './dto/room.create.dto';
import { UpdateRoomDto } from './dto/room.update.dto';
import { Room, RoomDocument } from './schema/room.schema';

@Injectable()
export class RoomService {
	constructor(@InjectModel(Room.name) private RoomModel: Model<RoomDocument>) {}

	async findAll(): Promise<Room[]> {
		return this.RoomModel.find().lean().exec();
	}
	async findAllByMember(userId: Types.ObjectId): Promise<Room[]> {
		const query: any = { users: userId };
		return this.RoomModel.find(query)
			.populate({ path: 'users', select: '-password -email' })
			.populate({ path: 'owner', select: '-password -email' })
			.lean()
			.exec();
	}
	async findAllByOwner(userId: Types.ObjectId): Promise<Room[]> {
		const query: any = { owner: userId };
		return this.RoomModel.find(query)
			.populate({ path: 'users', select: '-password -email' })
			.populate({ path: 'owner', select: '-password -email' })
			.lean()
			.exec();
	}

	async findById(id: Types.ObjectId): Promise<Room> {
		return this.RoomModel.findById(id)
			.populate({ path: 'users', select: '-password -email' })
			.populate({ path: 'owner', select: '-password -email' })
			.lean()
			.exec();
	}
	async findByName(name: string): Promise<Room[]> {
		return this.RoomModel.find({ name })
			.populate({ path: 'users', select: '-password -email' })
			.populate({ path: 'owner', select: '-password -email' })
			.lean()
			.exec();
	}

	async addOne(newRoom: CreateRoomDto) {
		const room = new this.RoomModel(newRoom);
		room._id = Types.ObjectId();
		return room.save();
	}

	async updateOne(id: Types.ObjectId, newRoom: UpdateRoomDto) {
		const room = await this.RoomModel.findById(id);
		room.set(newRoom);
		return room.save();
	}

	async addUser(id: Types.ObjectId, user: Types.ObjectId) {
		const room = await this.RoomModel.findById(id);
		room.users.push(user as any);
		return room.save();
	}

	async removeUser(id: Types.ObjectId, userId: Types.ObjectId) {
		const room = await this.RoomModel.findById(id);

		room.users.splice(
			room.users.findIndex((el) => el._id.equals(userId)),
			1,
		);
		return room.save();
	}
}
