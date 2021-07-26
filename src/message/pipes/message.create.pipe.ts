import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException,
} from '@nestjs/common';
import { isValidObjectId, Types } from 'mongoose';
import { CreateMessageDto } from '../dto/message.create.dto';

@Injectable()
export class CreateMessagePipe implements PipeTransform<any, CreateMessageDto> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	transform(value: any, metadata: ArgumentMetadata): CreateMessageDto {
		const result: CreateMessageDto = value;
		if (isValidObjectId(value.author)) {
			result.author = new Types.ObjectId(value.author);
		} else {
			throw new BadRequestException('author should be an ObjectId');
		}
		if (value.forwardOf) {
			if (isValidObjectId(value.forwardOf)) {
				result.forwardOf = new Types.ObjectId(value.forwardOf);
			} else {
				throw new BadRequestException('forwardOf should be an ObjectId');
			}
		}
		return result;
	}
}
