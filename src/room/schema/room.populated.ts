import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { PublicUser } from 'src/user/dto/user.public.dto';

export class PopulatedRoom {
	@ApiProperty({ type: String })
	_id: Types.ObjectId;

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;

	@ApiProperty({
		type: [PublicUser],
		description: 'Array of User objects that are members in this room',
	})
	users: PublicUser[];

	@ApiProperty({
		type: PublicUser,
		description: 'The User that owns this room',
	})
	owner: PublicUser;
}
