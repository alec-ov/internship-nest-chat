import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import {
	CreateRoomDto,
	PopulatedRoom,
	SendMessageDto,
	UnpopulatedRoom,
} from './room.dto';
import { RoomService } from './room.service';
import { Types } from 'mongoose';
import {
	ApiCreatedResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import {
	CreateMessageDto,
	PopulatedMessage,
	SearchMessageDto,
	UnpopulatedMessage,
	UpdateMessageDto,
} from 'src/message/message.dto';

@ApiTags('Room')
@Controller('room')
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

	@Post('/')
	async addOne(@Body() newRoom: CreateRoomDto) {
		return await this.roomService.addOne(newRoom);
	}

	@Get('/id/:id')
	@ApiOperation({ description: 'Get one room with specified id' })
	@ApiResponse({ type: PopulatedRoom })
	async findById(@Param('id') roomId: string) {
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
	async findByUser(@Param('user') userId: string) {
		return await this.roomService.findAllByMember(userId);
	}

	@Get('/owned/:user')
	@ApiOperation({ description: 'Get all rooms owned by a specific User' })
	@ApiResponse({
		type: [PopulatedRoom],
		description: 'A list of all rooms where Room.owner === User',
	})
	async findByOwner(@Param('user') userId: string) {
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
	async removeUser(@Param('id') roomId: string, @Body('id') userId: string) {
		return await this.roomService.removeUser(roomId, userId);
	}

	@Post('/id/:id/message/send')
	@ApiOperation({ description: 'Adds a message to this room' })
	@ApiCreatedResponse({ type: UnpopulatedMessage })
	async addMessage(
		@Param('id') roomId: string,
		@Body() message: SendMessageDto,
	) {
		const newMessage: CreateMessageDto = {
			...message,
			room: new Types.ObjectId(roomId),
		};
		return await this.messageService.addOne(newMessage);
	}

	@ApiOperation({ description: 'Edit text of the message' })
	@ApiResponse({ type: UnpopulatedMessage })
	@Patch('/id/:id/message/edit')
	async editMessage(
		@Param('id') roomId: string,
		@Body() message: UpdateMessageDto,
	) {
		return await this.messageService.updateOne(message);
	}

	@Get('/id/:id/message/')
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
	@Get('/id/:id/message/search')
	async searchMessages(
		@Param('id') roomId: string,
		@Query() query: SearchMessageDto,
	) {
		return await this.messageService.search(roomId, query);
	}
}
