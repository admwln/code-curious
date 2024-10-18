<script lang="ts">
	import { currentPanel } from '$lib/store';
	import { isRunning } from '$lib/store';

	import {
		faChalkboardUser,
		faCode,
		faDesktop,
		faFilter,
		faMinus,
		faPause,
		faPlay,
		faPlus,
	} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	import Matter from '../components/Matter.svelte';
	// Modified skeleton components
	import Accordion from '../components/skeleton/Accordion.svelte';
	import AccordionItem from '../components/skeleton/AccordionItem.svelte';

	// Keep track of if the simulation is running
	function toggleRun() {
		$isRunning = !$isRunning;
	}
</script>

<!-- Panel 1: Tutorial -->
<div
	class="bg-neutral-900 md:mr-0.5 lg:mx-0 w-full h-screen md:w-1/2 lg:w-1/3 lg:block {$currentPanel !==
	1
		? 'hidden'
		: ''} overflow-y-scroll"
>
	<h2 class="text-start w-full flex items-center gap-4 space-x-4 py-3 px-4 bg-[#ec489a2A]">
		<FontAwesomeIcon icon={faChalkboardUser} /> Tutorial
	</h2>
	<h3 class="p-4">The Basics</h3>
	<ul class="p-4 list">
		<li>Data types</li>
		<li>Variables</li>
		<li>Operators</li>
		<li>Functions</li>
		<li>Loops</li>
	</ul>
	<p class="p-4">An array is a special variable, which can hold more than one value:</p>
	<code class="p-4 block">["apple", "banana", "orange"]</code>
	<p class="p-4">
		You access an array element by referring to the index number. This statement accesses the value
		of the first element in fruits.
	</p>
</div>

<!-- Panel 2: Editor & Console -->
<div
	class="bg-neutral-900 md:mr-0.5 lg:mx-0.5 w-full h-screen md:w-1/2 lg:w-1/3 lg:block {$currentPanel !==
	2
		? 'hidden'
		: ''} overflow-y-scroll"
>
	<Accordion>
		<AccordionItem open>
			<svelte:fragment slot="iconClosed"><FontAwesomeIcon icon={faMinus} /></svelte:fragment>
			<svelte:fragment slot="iconOpen"><FontAwesomeIcon icon={faPlus} /></svelte:fragment>
			<svelte:fragment slot="lead"><FontAwesomeIcon icon={faCode} /></svelte:fragment>
			<svelte:fragment slot="summary">
				<div class="flex justify-between">
					<h2>Editor</h2>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="content">Here you will find all the code blocks!</svelte:fragment>
		</AccordionItem>
		<AccordionItem open>
			<svelte:fragment slot="iconClosed"><FontAwesomeIcon icon={faMinus} /></svelte:fragment>
			<svelte:fragment slot="iconOpen"><FontAwesomeIcon icon={faPlus} /></svelte:fragment>
			<svelte:fragment slot="lead"><FontAwesomeIcon icon={faDesktop} /></svelte:fragment>
			<svelte:fragment slot="summary"><h2>Console</h2></svelte:fragment>
			<svelte:fragment slot="content">
				<div class="rounded-md bg-slate-900 p-4">
					<code class="block">Hello World!</code>
				</div>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>
</div>

<!-- Panel 3: Funnel (matter.js) -->
<div
	class="bg-neutral-900 w-full h-screen md:w-1/2 lg:w-1/3 lg:block {$currentPanel !== 3
		? 'hidden md:block lg:block'
		: ''} overflow-y-scroll"
>
	<div
		class="text-start w-full flex items-center justify-between space-x-4 py-2 px-4 bg-[#ec489a2a]"
	>
		<h2 class="flex items-center gap-4"><FontAwesomeIcon icon={faFilter} /> Funnel</h2>
		<button type="button" on:click={toggleRun} class="btn btn-sm bg-primary-900 flex gap-2">
			{#if $isRunning}
				<FontAwesomeIcon icon={faPause} /> Running
			{/if}
			{#if !$isRunning}
				<FontAwesomeIcon icon={faPlay} /> Run
			{/if}
		</button>
	</div>
	<Matter />
</div>
