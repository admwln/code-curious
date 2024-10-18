<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { currentPanel, isRunning } from '$lib/store';
	import { initMatterJS, startMatter, stopMatter } from '$lib/matter';
	import type { MatterInstance } from '$lib/matter'; // Import the type
	import Matter from 'matter-js';

	let matterContainer: HTMLElement;

	// This will hold the instance returned by initMatterJS (contains engine, runner, etc.)
	let matterInstance: MatterInstance | null = null; // Initialize as null

	// Track the running state reactively
	$: running = $isRunning;

	onMount(() => {
		if (matterContainer) {
			// Initialize Matter.js and store the instance, needs container dimensions to work
			// TODO pass these as props from the parent component
			matterInstance = initMatterJS(matterContainer, { width: 450, height: 700 });
		}
	});

	// Reactively control Matter.js based on the play state
	$: if (running && matterInstance) {
		startMatter(matterInstance.runner, matterInstance.engine);
	} else if (matterInstance) {
		stopMatter(matterInstance.runner);
	}

	onDestroy(() => {
		// Clean up Matter.js on component destroy
		if (matterInstance) {
			Matter.Engine.clear(matterInstance.engine);
			stopMatter(matterInstance.runner);
		}
	});
</script>

<section class="w-full flex justify-center">
	<div bind:this={matterContainer}></div>
</section>

<style>
	div {
		width: 450px;
		height: 700px;
	}
</style>
