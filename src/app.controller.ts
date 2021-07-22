import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/')
	@ApiResponse({
		type: typeof {
			uptime: { days: Number, Hours: Number, Minutes: Number, Seconds: Number },
			localTime: Date,
		},
	})
	getServerInfo() {
		return {
			uptime: this.appService.getUptime(),
			localTime: new Date().toLocaleString('en-ES'),
		};
	}
}
