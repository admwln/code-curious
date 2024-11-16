import { writable } from 'svelte/store';
import type { MatterInstance } from '../../lib/types';

// Store to track which panel is currently active
export const currentPanel = writable(1);

// Store to track if code and Matter.js simulation is playing
export const isRunning = writable(false);

// Store to fire when matter engine should be reset
export const resetMatterFlag = writable(false);

export const matterInstanceStore = writable<MatterInstance | null>(null);
