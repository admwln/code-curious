//Just a placeholder, we need a type for matter actions
import { writable } from 'svelte/store';
import type { Action } from '$lib/types';

// Store to keep track of (matter) action data
export const actionOutput = writable<Action[]>([]);

export const executeMatterAction = async (action: Action) => {
	return new Promise((resolve) => {
		// Update the consoleOutput store with new log entry
		actionOutput.update((output) => [...output, action]);

		// Resolve after a slight delay to simulate async processing
		setTimeout(() => {
			resolve(true); // Resolves after log completes
		}, 1000); // Delay can be adjusted as needed
	});
};
