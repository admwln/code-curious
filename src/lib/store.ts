import { writable } from 'svelte/store';
import type { VariableType } from './types';

// Store to track which panel is currently active
export const currentPanel = writable(1);

// Store to track if the Matter.js simulation is playing
export const isRunning = writable(false);

// Store to track user-created variables in editor
export const snapshot = writable<VariableType[]>([]);
