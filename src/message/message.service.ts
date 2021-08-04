import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateMessageDto } from './dto/message.create.dto';
import { SearchMessageDto } from './dto/message.search.dto';
import { UpdateMessageDto } from './dto/message.update.dto';
import { Message, MessageDocument } from './schema/message.schema';

@Injectable()
export class MessageService {
	constructor(
		@InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
	) {}

	async findAllByRoom(
		roomId: string,
		fromDate: Date = new Date(0),
		toDate: Date = new Date(Date()),
	): Promise<Message[]> {
		const query: any = {
			room: Types.ObjectId(roomId),
			edited_at: { $gt: fromDate, $lte: toDate },
		};
		return this.MessageModel.find(query)
			.populate({
				path: 'author',
				select: '-password -email',
			})
			.populate({
				path: 'forwardOf',
				populate: { path: 'author', select: '-password -email' },
			})
			.sort({ sent_at: 1 })
			.lean();
	}

	async findAllByAuthor(
		authorId: string,
		fromDate: Date = new Date(0),
		toDate: Date = new Date(),
	): Promise<Message[]> {
		const query: any = {
			author: authorId,
			edited_at: { $gt: fromDate, $lte: toDate },
		};
		return this.MessageModel.find(query)
			.populate({
				path: 'author',
				select: '-password -email',
			})
			.populate({
				path: 'forwardOf',
				populate: { path: 'author', select: '-password -email' },
			})
			.sort({ sent_at: 1 })
			.lean();
	}

	async search(roomId: string, search: SearchMessageDto) {
		const query: any = { room: Types.ObjectId(roomId) };

		if (search.text) query.$text = { $search: String(search.text) };

		if (search.author) query.author = search.author;

		if (search.from_date || search.to_date)
			query.edited_at = {
				$gte: search.from_date ? new Date(search.from_date) : new Date(0),
				$lte: search.to_date ? new Date(search.to_date) : Date(),
			};

		return this.MessageModel.find(query)
			.populate('author')
			.populate({ path: 'forwardOf', populate: { path: 'author' } })
			.sort({ sent_at: 1 })
			.lean();
	}

	async findById(id: string): Promise<Message> {
		return this.MessageModel.findById(new Types.ObjectId(id))
			.populate('author')
			.populate({ path: 'forwardOf', populate: { path: 'author' } })
			.sort({ sent_at: 1 })
			.lean()
			.exec();
	}

	async updateOne(newMessage: UpdateMessageDto) {
		const message = await this.MessageModel.findById(
			new Types.ObjectId(newMessage.id),
		);
		if (!message)
			throw new NotFoundException('cannot find message ' + newMessage.id);
		message.text = newMessage.text;
		return message.save();
	}

	async addOne(newMessage: CreateMessageDto) {
		if (typeof newMessage.forwardOf == 'string')
			newMessage.forwardOf = Types.ObjectId(newMessage.forwardOf);
		if (typeof newMessage.room == 'string')
			newMessage.room = Types.ObjectId(newMessage.room);
		if (typeof newMessage.author == 'string')
			newMessage.author = Types.ObjectId(newMessage.author);

		const message = new this.MessageModel(newMessage);
		message._id = Types.ObjectId();

		const messageDocument = await message.save();
		return messageDocument
			.populate('author')
			.populate({ path: 'forwardOf', populate: { path: 'author' } })
			.execPopulate();
	}
}
