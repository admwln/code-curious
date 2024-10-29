// src/lib/stores/snapshots.ts
import { writable } from 'svelte/store';

// Store to track user-created variables in editor, for current lesson
export const snapshot = writable<any[]>([]);

// Stores a snapshot for each lesson using the lessonId as the key
export const snapshots = writable<Record<string, any>>({});

// Function to save the current Editor snapshot to snapshots under the current lessonId
export function saveSnapshot(lessonId: string, editorSnapshot: any[]) {
	snapshots.update((allSnapshots) => {
		allSnapshots[lessonId] = JSON.parse(JSON.stringify(editorSnapshot)); // Deep clone to avoid reference issues
		return allSnapshots;
	});
}

// Function to load a snapshot from snapshots into snapshot store based on lessonId
export function loadSnapshot(lessonId: string) {
	snapshots.subscribe((allSnapshots) => {
		snapshot.set(allSnapshots[lessonId] || []);
	});
}

// Function to clear snapshot for a new lesson
// NB currently not in use, $snapshot is reset onMount directly in Editor.svelte
export function resetSnapshot() {
	snapshot.set([]); // Clear the current snapshot
}
