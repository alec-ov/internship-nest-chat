import { UseGuards } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
	WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Types } from 'mongoose';
import { WsJwtAuthGuard } from 'src/auth/guards/ws.jwt.guard';
import { CreateMessageDto } from 'src/message/dto/message.create.dto';
import { UpdateMessageDto } from 'src/message/dto/message.update.dto';
import { MessageService } from 'src/message/message.service';
import { PublicUser } from 'src/user/dto/user.public.dto';
import { Role } from 'src/user/enums/user.role.enum';
import { RoomService } from './room.service';

@WebSocketGateway(8080, {
	transports: ['websocket', 'polling'],
	cors: { origin: '*' },
})
export class RoomGateway {
	constructor(
		private readonly roomService: RoomService,
		private readonly messageService: MessageService,
	) {}

	@WebSocketServer() io;

	@SubscribeMessage('init')
	async init(
		@MessageBody() body,
		@ConnectedSocket() socket,
	): Promise<WsResponse<unknown>> {
		const userId = new Types.ObjectId(body.id);
		if (!userId) return;
		const rooms = await this.roomService.findAllByMember(userId);
		for (const room of rooms) {
			socket.join('room_' + room._id);
		}
		//return { event: 'response', data: body };
	}

	@SubscribeMessage('clientSendMessage')
	@UseGuards(WsJwtAuthGuard)
	async sendMessage(
		@MessageBody('message') message: CreateMessageDto,
		@MessageBody('user') user: PublicUser,
	) {
		const roomId = message.room;
		const room = await this.roomService.findById(roomId);

		message.author = new Types.ObjectId(message.author);

		if (!message.author.equals(user._id)) {
			throw new WsException('unauthorized');
		}

		if (room.users.some((user) => user._id.equals(message.author))) {
			const messageDoc = await this.messageService.addOne(message);
			const newMessage = messageDoc; //await this.messageService.findById(_id);

			this.io.in('room_' + roomId).emit('message', [newMessage]);
		}
	}

	@SubscribeMessage('clientEditMessage')
	@UseGuards(WsJwtAuthGuard)
	async editMessage(
		@MessageBody('room') roomId: string,
		@MessageBody('message') message: UpdateMessageDto,
		@MessageBody('user') user: PublicUser,
		@ConnectedSocket() socket: Socket,
	) {
		const room = await this.roomService.findById(new Types.ObjectId(roomId));

		const messageDoc = await this.messageService.findById(
			message.id.toString(),
		);

		if (
			!(
				messageDoc.author._id.equals(user._id) || // edit only own messages
				// admins and group owners can delete anything
				(message.text == '' &&
					(room.owner._id.equals(user._id) || user.role == Role.Admin))
			)
		) {
			socket.emit('unauthorized');
			throw new WsException('unauthorized');
		}

		const newMessage = await this.messageService.updateOne(message); //await this.messageService.findById(_id);

		this.io.in('room_' + roomId).emit('messageEdit', newMessage);
	}
}
