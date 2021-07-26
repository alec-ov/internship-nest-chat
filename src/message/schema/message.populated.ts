import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { PublicUser } from 'src/user/dto/user.public.dto';
import { UnpopulatedMessage } from './message.unpopulated';

export class PopulatedMessage {
	@ApiProperty({ type: String })
	_id: Types.ObjectId;

	@ApiProperty()
	text: string;

	@ApiProperty()
	author: PublicUser;

	@ApiProperty({ type: String })
	room: Types.ObjectId;

	@ApiPropertyOptional({
		type: UnpopulatedMessage,
		description: 'If defined, this message is a reply to the specified message',
	})
	ForwardOf?: UnpopulatedMessage;
}
