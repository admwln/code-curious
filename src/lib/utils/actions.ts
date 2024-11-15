import Matter from 'matter-js';
import { get, writable } from 'svelte/store';
import { matterInstanceStore } from '../stores/store';
import type { Action, MatterInstance } from '$lib/types';

// Store to keep track of snapshot for duration of running code
export const actionSnapshot = writable<any[]>([]);

// Store to keep track of (matter) action data
export const matterActionOutput = writable<Action[]>([]);

// actions.ts
export const executeAction = async (action: Action) => {
	return new Promise((resolve) => {
		if (
			action.action === 'create circle' ||
			action.action === 'create square' ||
			action.action === 'create triangle'
		) {
			matterActionOutput.update((output) => [...output, action]);
		} else if (action.action === 'increase' && action.variableId) {
			// Update variable
			actionSnapshot.update((snapshot) => {
				const updatedSnapshot = snapshot.map((item) => {
					if (item.id === action.variableId) {
						return { ...item, value: item.value + 1 };
					}
					return item;
				});
				return updatedSnapshot;
			});
		} else if (action.action === 'decrease' && action.variableId) {
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

		// Resolve after a set delay
		setTimeout(() => {
			resolve(true);
		}, 500);
	});
};

export function waitForStability(): Promise<void> {
	const matterInstance = get(matterInstanceStore) as MatterInstance;
	const velocityThreshold = 1.0; // Lower value means more leeway before deemed stable
	const angularVelocityThreshold = 0.1;

	return new Promise((resolve) => {
		const interval = 2500; // Check every x milliseconds

		const checkStability = () => {
			const allBodies = Matter.Composite.allBodies(matterInstance.engine.world);
			const isStable = allBodies.every((body) => {
				const belowVelocityThreshold =
					Math.abs(body.velocity.x) < velocityThreshold &&
					Math.abs(body.velocity.y) < velocityThreshold;
				const belowAngularVelocityThreshold =
					Math.abs(body.angularVelocity) < angularVelocityThreshold;
				return body.isSleeping || (belowVelocityThreshold && belowAngularVelocityThreshold);
			});

			if (isStable) {
				clearInterval(stabilityCheckInterval); // Stop the interval once stable
				resolve(); // Resolve the promise once stability is confirmed
			}
		};

		// Run the stability check at the specified interval
		const stabilityCheckInterval = setInterval(checkStability, interval);

		// Clean up interval if engine is destroyed before stability is reached
		Matter.Events.on(matterInstance.engine, 'beforeRemove', () => {
			clearInterval(stabilityCheckInterval);
		});
	});
}
