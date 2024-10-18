import { writable } from 'svelte/store';

// Store to track which panel is currently active
export const currentPanel = writable(1);

// Store to track if the Matter.js simulation is playing
export const isPlaying = writable(false);
