import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getUptime() {
		const uptime = process.uptime();
		const duration: any = {
			days: Math.floor(uptime / (60 * 60 * 24)),
		};
		duration.hours = Math.floor(uptime / (60 * 60)) - duration.days * 24;
		duration.minutes = Math.floor(uptime / 60) - duration.hours * 60;
		duration.seconds = Math.floor(uptime) - duration.minutes * 60;

		return duration;
	}
}
