import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
//import { MessageService } from './message/message.service';
import { MessageModule } from './message/message.module';

@Module({
	imports: [
		MongooseModule.forRoot(process.env.DB_URI, { useCreateIndex: true }),
		UserModule,
		RoomModule,
		MessageModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
