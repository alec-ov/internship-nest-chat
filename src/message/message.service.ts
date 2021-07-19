import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
	createMessageDto,
	Message,
	MessageDocument,
	messageSearchDto,
	updateMessageDto,
} from './message.model';

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
			.populate('author')
			.populate({ path: 'forwardOf', populate: { path: 'author' } })
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
			.populate('author')
			.populate({ path: 'forwardOf', populate: { path: 'author' } })
			.sort({ sent_at: 1 })
			.lean();
	}

	async search(roomId: string, search: messageSearchDto) {
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
		return this.MessageModel.findById(id)
			.populate('author')
			.populate({ path: 'forwardOf', populate: { path: 'author' } })
			.sort({ sent_at: 1 })
			.lean()
			.exec();
	}

	async updateOne(id: string, newMessage: updateMessageDto) {
		const message = await this.MessageModel.findById(id);
		message.text = newMessage.text;
		return message.save();
	}

	async addOne(newMessage: createMessageDto) {
		const message = new this.MessageModel(newMessage);
		message._id = Types.ObjectId();
		return message.save();
	}
}
