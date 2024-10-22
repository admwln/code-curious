<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { currentPanel, isRunning } from '$lib/store';
	import { initMatterJS, startMatter, stopMatter, type MatterInstance } from '$lib/matter';
	import Matter from 'matter-js';

	// Expose the data prop to receive the data from the parent +page.svelte
	export let data;
	let matterInstance: MatterInstance | null = null;
	let matterContainer: HTMLElement | null = null;

	// Track the running state reactively
	$: running = $isRunning;

	// Helper to clean up the current Matter.js instance
	function cleanupMatterInstance() {
		if (matterInstance) {
			stopMatter(matterInstance.runner);
			Matter.Engine.clear(matterInstance.engine);
			Matter.World.clear(matterInstance.engine.world, false); // Clear all bodies including static ones
			// Remove the canvas element
			const container = document.querySelector('#matterContainer');
			const canvas = container?.querySelector('canvas');
			if (canvas) {
				canvas.remove(); // Ensure canvas is removed
			}
		}
	}

	// Initialize Matter.js when the component mounts
	onMount(() => {
		if (matterContainer) {
			matterInstance = initMatterJS(matterContainer, { width: 450, height: 700 }, data.color);
		}
	});

	// Clean up Matter.js when the component is destroyed
	onDestroy(() => {
		cleanupMatterInstance();
	});

	// Reinitialize Matter.js whenever the lesson `data` changes
	$: if (data && matterContainer) {
		cleanupMatterInstance(); // First, clean up the old instance
		// Toggle running state to false, NB must be run after cleanup
		$isRunning = false;
		matterInstance = initMatterJS(matterContainer, { width: 450, height: 700 }, data.color); // Reinitialize with new data
	}

	// Reactively control Matter.js based on the running state
	$: if (running && matterInstance) {
		startMatter(matterInstance.runner, matterInstance.engine);
	} else if (matterInstance) {
		stopMatter(matterInstance.runner);
	}
</script>

<section class="w-full flex justify-center">
	<div id="matterContainer" bind:this={matterContainer}></div>
</section>

<style>
	div {
		width: 450px;
		height: 700px;
	}
</style>
