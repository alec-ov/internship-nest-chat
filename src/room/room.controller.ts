import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { createRoomDto, sendMessageDto } from './room.model';
import { RoomService } from './room.service';
import { Types } from 'mongoose';
import { createMessageDto } from 'src/message/message.model';

@Controller('room')
export class RoomController {
	constructor(
		private roomService: RoomService,
		private messageService: MessageService,
	) {}

	@Get('/')
	async findAll() {
		return { data: await this.roomService.findAll() };
	}

	@Post('/')
	async addOne(@Body() newRoom: createRoomDto) {
		return { data: await this.roomService.addOne(newRoom) };
	}

	@Get('/id/:id')
	async findById(@Param('id') roomId: string) {
		return {
			data: await this.roomService.findById(roomId),
		};
	}

	@Get('/name/:name')
	async findByName(@Param('name') name: string) {
		return {
			data: await this.roomService.findByName(name),
		};
	}

	@Get('/user/:user')
	async findByUser(@Param('user') userId: string) {
		return {
			data: await this.roomService.findAllByMember(userId),
		};
	}

	@Get('/owned/:user')
	async findByOwner(@Param('user') userId: string) {
		return {
			data: await this.roomService.findAllByOwner(userId),
		};
	}

	@Post('/id/:id/join')
	async addUser(@Param('id') roomId, @Body('id') userId) {
		return {
			data: await this.roomService.addUser(roomId, userId),
		};
	}

	@Post('/id/:id/leave')
	async removeUser(@Param('id') roomId: string, @Body('id') userId: string) {
		return {
			data: await this.roomService.removeUser(roomId, userId),
		};
	}

	@Post('/id/:id/send')
	async addMessage(
		@Param('id') roomId,
		@Body('message') message: sendMessageDto,
	) {
		const newMessage: createMessageDto = {
			...message,
			room: new Types.ObjectId(roomId),
		};
		return {
			data: await this.messageService.addOne(newMessage),
		};
	}
}
