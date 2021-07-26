// TODO: move this to Redis
export const keyStorage = {
	jwt: '',
};

export function getRandomString(): string {
	let str = '';
	for (let i = 0; i < 4; i++) {
		str += Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
	}
	return str;
}
export function resetKey(): void {
	keyStorage.jwt = getRandomString();
}

resetKey();
