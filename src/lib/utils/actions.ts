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
		if (action.action === 'create circle') {
			matterActionOutput.update((output) => [...output, action]);
		} else if (action.action === 'create square') {
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
		}, 1000);
	});
};

export function waitForStability(): Promise<void> {
	const matterInstance = get(matterInstanceStore) as MatterInstance;
	const velocityThreshold = 0.05; // Lower value means more leeway before deemed stable
	const angularVelocityThreshold = 0.005;

	return new Promise((resolve) => {
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
				Matter.Events.off(matterInstance.engine, 'afterUpdate', checkStability);
				resolve(); // Resolve the promise once stability is confirmed
			}
		};

		// Attach `checkStability` to the `afterUpdate` event
		Matter.Events.on(matterInstance.engine, 'afterUpdate', checkStability);
	});
}
