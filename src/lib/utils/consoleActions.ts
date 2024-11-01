// consoleActions.ts
import { writable } from 'svelte/store';
import type { LogBlock } from '$lib/types';

// Store to keep track of console output data
export const consoleOutput = writable<LogBlock[]>([]);

export async function logToConsole(block: LogBlock) {
	return new Promise((resolve) => {
		// Example of formatting the message for the Console component
		const logMessage = block;

		// Update the consoleOutput store with new log entry
		consoleOutput.update((output) => [...output, logMessage]);

		// Resolve after a slight delay to simulate async processing
		setTimeout(() => {
			resolve(true); // Resolves after log completes
		}, 1000); // Delay can be adjusted as needed
	});
}

export const clearConsole = () => {
	consoleOutput.set([]);
};
