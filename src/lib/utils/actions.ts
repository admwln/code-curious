import { writable } from 'svelte/store';
import type { Action } from '$lib/types';

// Store to keep track of snapshot for duration of running code
export const actionSnapshot = writable<any[]>([]);

// Store to keep track of (matter) action data
export const matterActionOutput = writable<Action[]>([]);

export const executeAction = async (action: Action) => {
	return new Promise((resolve) => {
		if (action.action === 'drop') {
			console.log('Drop action has been called');
			matterActionOutput.update((output) => [...output, action]);
		}

		if (action.action === 'increase' && action.variableId) {
			//actionVar.value = actionVar.value + 1;
			// Update the actionSnapshot, to reflect the new value of the variable
			actionSnapshot.update((snapshot) => {
				const updatedSnapshot = snapshot.map((item) => {
					if (item.id === action.variableId) {
						return { ...item, value: item.value + 1 };
					}
					return item;
				});
				return updatedSnapshot;
			});
		}

		if (action.action === 'decrease' && action.variableId) {
			//actionVar.value = actionVar.value + 1;
			// Update the actionSnapshot, to reflect the new value of the variable
			actionSnapshot.update((snapshot) => {
				const updatedSnapshot = snapshot.map((item) => {
					if (item.id === action.variableId) {
						return { ...item, value: item.value - 1 };
					}
					return item;
				});
				return updatedSnapshot;
			});
		}

		// To simulate an asynchronous action, we'll use setTimeout to resolve the promise after 1 second
		setTimeout(() => {
			resolve(true);
		}, 1000);
	});
};
