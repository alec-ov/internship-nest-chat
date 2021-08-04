import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schema/room.schema';
import { MessageModule } from 'src/message/message.module';
//import { MessageService } from 'src/message/message.service';
import { Message, MessageSchema } from 'src/message/schema/message.schema';
import { AuthModule } from 'src/auth/auth.module';
import { RoomGateway } from './room.gateway';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Room.name, schema: RoomSchema },
			{ name: Message.name, schema: MessageSchema },
		]),
		MessageModule,
		AuthModule,
	],
	providers: [RoomService, RoomGateway],
	controllers: [RoomController],
})
export class RoomModule {}
