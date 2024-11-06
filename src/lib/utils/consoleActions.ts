// consoleActions.ts
import { writable } from 'svelte/store';
import type { Log } from '$lib/types';

// Store to keep track of console output data
export const consoleOutput = writable<Log[]>([]);

export async function logToConsole(block: Log, logVar: Record<string, any> | null) {
	return new Promise((resolve) => {
		// Example of formatting the message for the Console component
		let logMessage = block;
		// Add the logVar, if any, to the logMessage.value
		if (logVar) {
			logMessage.value = logVar.value;
		}

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
