import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './room.model';
import { MessageModule } from 'src/message/message.module';
//import { MessageService } from 'src/message/message.service';
import { Message, MessageSchema } from 'src/message/message.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Room.name, schema: RoomSchema },
			{ name: Message.name, schema: MessageSchema },
		]),
		MessageModule,
	],
	providers: [RoomService],
	controllers: [RoomController],
})
export class RoomModule {}
