import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UnpopulatedMessage {
	@ApiProperty({ type: String })
	_id: Types.ObjectId;

	@ApiProperty()
	text: string;

	@ApiProperty({ type: String })
	author: Types.ObjectId;

	@ApiProperty({ type: String })
	room: Types.ObjectId;

	@ApiPropertyOptional({
		type: String,
		description:
			'If defined, this message is a reply to the message with specified ObjectId',
	})
	ForwardOf?: Types.ObjectId;
}
