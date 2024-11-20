// When we're trying to delete a variable, we should
// check if it's used in any logs or actions before deleting it.
// checkIfDeletable() checks if a given variable exists as a
// variableId in any of the existing logs or actions in the
// current snapshot. If it does, it returns false, otherwise
// it returns true.
import { get } from 'svelte/store';
import { snapshot } from '../stores/snapshots';

export const checkIfDeletable = (variableId: number): boolean => {
	// Access the current value of the snapshot store
	const _snapshot: Record<string, any>[] = get(snapshot);

	// Iterate through the snapshot to check for variable usage
	for (let i = 0; i < _snapshot.length; i++) {
		const block = _snapshot[i];
		if (block.blockType === 'action' && block.variableId === variableId) {
			return false; // Variable is being used in a log, cannot delete
		}
		if (block.blockType === 'log' && block.selectedId === variableId) {
			return false; // Variable is being used in a log, cannot delete
		}
	}

	return true; // Variable is not used, safe to delete
};
