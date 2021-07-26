import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { PublicUser } from 'src/user/dto/user.public.dto';

export class UnpopulatedRoom {
	@ApiProperty({ type: String })
	_id: Types.ObjectId;

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;

	@ApiProperty({
		type: [String],
		description: 'Array of ObjectId-s of users that are members in this room',
	})
	users: Types.ObjectId[];

	@ApiProperty({
		type: String,
		description: 'ObjectId of a User that owns this room',
	})
	owner: PublicUser;
}
