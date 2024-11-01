//Just a placeholder, we need a type for matter actions
import type { LogBlock } from '$lib/types';

export const executeMatterAction = async (block: LogBlock) => {
	const { message } = block;
	console.log(message);
};
