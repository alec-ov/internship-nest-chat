import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException,
} from '@nestjs/common';
import { isValidObjectId, Types } from 'mongoose';
import { UpdateMessageDto } from '../dto/message.update.dto';

@Injectable()
export class UpdateMessagePipe implements PipeTransform<any, UpdateMessageDto> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	transform(value: any, metadata: ArgumentMetadata): UpdateMessageDto {
		const result: UpdateMessageDto = value;
		if (isValidObjectId(value.id)) {
			result.id = new Types.ObjectId(value.id);
		} else {
			throw new BadRequestException('author should be an ObjectId');
		}
		return result;
	}
}
