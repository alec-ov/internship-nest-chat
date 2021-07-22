import * as dotenv from 'dotenv';
dotenv.config();

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle('Simple chat')
		.setDescription('A basic chat')
		.setVersion('0.0.1')
		.build();
	const document = SwaggerModule.createDocument(app, config, {
		deepScanRoutes: true,
	});
	SwaggerModule.setup('api', app, document);

	app.useGlobalPipes(new ValidationPipe());
	await app.listen(process.env.PORT);
	Logger.log('Listening on port:' + process.env.PORT);
}
bootstrap();
