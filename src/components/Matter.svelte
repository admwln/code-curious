<script lang="ts">
	import { onMount } from 'svelte';
	import { initMatterJS } from '$lib/matter';

	// Define a reference to the container with the correct type
	let matterContainer: HTMLElement;

	//Initialize Matter.js after the component is mounted
	onMount(() => {
		if (matterContainer) {
			initMatterJS(matterContainer);
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
