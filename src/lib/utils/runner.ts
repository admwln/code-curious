import { snapshot } from '$lib/stores/snapshots';
import { isRunning } from '$lib/stores/store';
import { consoleOutput, logToConsole } from './consoleActions';
import { executeMatterAction } from './matterActions';

export async function runner() {
	isRunning.set(true); // Set the running state to true at the start

	console.log('snapshot accessed in runner', snapshot);
	// for (const block of snapshot as any) {
	// 	try {
	// 		if (block.blockType === 'variable') continue;
	// 		if (block.blockType === 'log') await logToConsole(block);
	// 		if (block.blockType === 'matterAction') await executeMatterAction(block);
	// 	} catch (error: any) {
	// 		// Capture and log error to the Console component
	// 		consoleOutput.update((output) => [...output, `Error: ${error.message}`]);
	// 	}
	// }

	isRunning.set(false); // Set to false when all blocks are processed
}
