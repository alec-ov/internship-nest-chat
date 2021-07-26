import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';

import { Types } from 'mongoose';
import {
	ApiCreatedResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';

import { MessageService } from 'src/message/message.service';

import { RoomService } from './room.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateMessagePipe } from 'src/message/pipes/message.create.pipe';
import { CreateRoomDto } from './dto/room.create.dto';
import { SendMessageDto } from './dto/room.send.dto';

import { UnpopulatedRoom } from './schema/room.unpopulated';
import { PopulatedRoom } from './schema/room.populated';
import { CreateMessageDto } from 'src/message/dto/message.create.dto';
import { SearchMessageDto } from 'src/message/dto/message.search.dto';
import { UpdateMessageDto } from 'src/message/dto/message.update.dto';
import { PopulatedMessage } from 'src/message/schema/message.populated';
import { UnpopulatedMessage } from 'src/message/schema/message.unpopulated';
import { UpdateMessagePipe } from 'src/message/pipes/message.update.pipe';

@ApiTags('Room')
@Controller('rooms')
export class RoomController {
	constructor(
		private roomService: RoomService,
		private messageService: MessageService,
	) {}

	@Get('/')
	@ApiOperation({ description: 'Get all existing rooms' })
	@ApiResponse({ type: [UnpopulatedRoom], description: 'List of all rooms' })
	async findAll() {
		return await this.roomService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Post('/')
	@ApiOperation({ description: 'Creates a new room' })
	@ApiResponse({ type: PopulatedRoom })
	async addOne(@Body() newRoom: CreateRoomDto) {
		return await this.roomService.addOne(newRoom);
	}

	@Get('/id/:id')
	@ApiOperation({ description: 'Get one room with specified id' })
	@ApiResponse({ type: PopulatedRoom })
	async findById(@Param('id') roomId: Types.ObjectId) {
		return await this.roomService.findById(roomId);
	}

	@Get('/name/:name')
	@ApiOperation({ description: 'Get one room with specified name' })
	@ApiResponse({ type: PopulatedRoom })
	async findByName(@Param('name') name: string) {
		return await this.roomService.findByName(name);
	}

	@Get('/user/:user')
	@ApiOperation({ description: 'Get all rooms for a specific User' })
	@ApiResponse({
		type: [PopulatedRoom],
		description: 'A list of all rooms where Room.users includes User',
	})
	async findByUser(@Param('user') userId: Types.ObjectId) {
		return await this.roomService.findAllByMember(userId);
	}

	@Get('/owned/:user')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ description: 'Get all rooms owned by a specific User' })
	@ApiResponse({
		type: [PopulatedRoom],
		description: 'A list of all rooms where Room.owner === User',
	})
	async findByOwner(@Param('user') userId: Types.ObjectId) {
		return await this.roomService.findAllByOwner(userId);
	}

	@Post('/id/:id/join')
	@ApiOperation({ description: 'Adds a User to this room' })
	@ApiResponse({
		type: [UnpopulatedRoom],
		description: 'The new Room document(unpopulated)',
	})
	async addUser(@Param('id') roomId, @Body('id') userId) {
		return await this.roomService.addUser(roomId, userId);
	}

	@Post('/id/:id/leave')
	@ApiOperation({ description: 'Removes a User from this room' })
	@ApiResponse({
		type: [UnpopulatedRoom],
		description: 'The new Room document(unpopulated)',
	})
	async removeUser(
		@Param('id') roomId: Types.ObjectId,
		@Body('id') userId: Types.ObjectId,
	) {
		return await this.roomService.removeUser(roomId, userId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/id/:id/messages/')
	@ApiOperation({ description: 'Adds a message to this room' })
	@ApiCreatedResponse({ type: UnpopulatedMessage })
	async addMessage(
		@Param('id') roomId: string,
		@Body(CreateMessagePipe) message: SendMessageDto,
	) {
		const newMessage: CreateMessageDto = {
			...message,
			room: new Types.ObjectId(roomId),
		};
		return await this.messageService.addOne(newMessage);
	}

	@UseGuards(JwtAuthGuard)
	@ApiOperation({ description: 'Edit text of the message' })
	@ApiResponse({ type: UnpopulatedMessage })
	@Patch('/id/:id/messages/')
	async editMessage(
		@Param('id') roomId: string,
		@Body(UpdateMessagePipe) message: UpdateMessageDto,
	) {
		return await this.messageService.updateOne(message);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/id/:id/messages/')
	@ApiOperation({ description: 'Get all messages of this room' })
	@ApiResponse({ type: [PopulatedMessage] })
	@ApiParam({
		name: 'from_date',
		required: false,
		description:
			'Date string, define to select only messages created after this date',
	})
	@ApiParam({
		name: 'to_date',
		required: false,
		description:
			'Date string, define to select only messages created before this date',
	})
	async getMessages(
		@Param('id') roomId: string,
		@Query('from_date') fromDateStr?: string,
		@Query('to_date') toDateStr?: string,
	) {
		const fromDate: Date = new Date(fromDateStr ?? 0);
		const toDate: Date = toDateStr ? new Date(toDateStr) : new Date();
		return await this.messageService.findAllByRoom(roomId, fromDate, toDate);
	}

	@ApiOperation({ description: 'Search messages in this room' })
	@ApiResponse({ type: [PopulatedMessage] })
	@Get('/id/:id/messages/search')
	async searchMessages(
		@Param('id') roomId: string,
		@Query() query: SearchMessageDto,
	) {
		return await this.messageService.search(roomId, query);
	}
}
