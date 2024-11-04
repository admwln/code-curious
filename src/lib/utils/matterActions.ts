//Just a placeholder, we need a type for matter actions
import type { Log } from '$lib/types';

export const executeMatterAction = async (block: Log) => {
	const { message } = block;
	console.log(message);
};
