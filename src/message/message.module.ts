import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message.shema';
import { MessageService } from './message.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
	],
	providers: [MessageService],
	exports: [MessageService],
})
export class MessageModule {}
