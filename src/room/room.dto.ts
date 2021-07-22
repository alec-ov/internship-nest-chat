import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';
import { PublicUser } from 'src/user/user.dto';
import { User } from 'src/user/user.schema';

export class CreateRoomDto {
	@ApiProperty()
	@IsNotEmpty()
	@Length(3, 25)
	name: string;

	@ApiPropertyOptional()
	@IsOptional()
	@Length(1, 100)
	description?: string;

	@ApiProperty({
		type: String,
		description: 'ObjectId of the User that owns this room',
	})
	@IsNotEmpty()
	owner: Types.ObjectId;
}
export class UpdateRoomDto {
	@ApiPropertyOptional()
	@IsOptional()
	@Length(3, 25)
	name?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@Length(1, 100)
	description?: string;

	@ApiPropertyOptional({
		type: String,
		description:
			'An ObjectId of the User that will be the new owner of this room',
	})
	@IsOptional()
	@Length(1, 100)
	owner?: Types.ObjectId;
}

export class SendMessageDto {
	@ApiProperty()
	@IsNotEmpty()
	text: string;

	@ApiPropertyOptional({
		type: String,
		description:
			'An ObjectId of another message, if defined, thus message is a "reply" to that message',
	})
	@IsOptional()
	@IsObjectId()
	forwardOf?: Types.ObjectId;

	@ApiProperty({
		type: String,
		description: 'An ObjectId of the User that sent this message',
	})
	@IsNotEmpty()
	@IsObjectId()
	author: Types.ObjectId;
}

// Response DTOs
class partialRoom {
	@ApiProperty({ type: String })
	_id: Types.ObjectId;

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;
}

export class PopulatedRoom extends partialRoom {
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

export class UnpopulatedRoom extends partialRoom {
	@ApiProperty({
		type: [String],
		description: 'Array of ObjectId-s of users that are members in this room',
	})
	users: User[];

	@ApiProperty({
		type: String,
		description: 'ObjectId of a User that owns this room',
	})
	owner: User;
}
