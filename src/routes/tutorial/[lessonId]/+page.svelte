<script lang="ts">
	import { currentPanel } from '$lib/stores/store';
	import { page } from '$app/stores'; // Store for dynamic routing
	// Imports for runner function:
	import { isRunning } from '$lib/stores/store';
	import { snapshot } from '$lib/stores/snapshots';
	import { consoleOutput, logToConsole } from '$lib/utils/consoleActions';
	import { executeMatterAction } from '$lib/utils/matterActions';

	import {
		faAngleDown,
		faAngleLeft,
		faAngleRight,
		faAngleUp,
		faChalkboardUser,
		faCode,
		faEye,
		faFilter,
		faRotateRight,
		faStop,
	} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	import Tutorial from '../../../components/Tutorial.svelte';
	import Editor from '../../../components/Editor.svelte';
	import Console from '../../../components/Console.svelte';
	import Matter from '../../../components/Matter.svelte';
	import Accordion from '../../../components/skeleton/Accordion.svelte';
	import AccordionItem from '../../../components/skeleton/AccordionItem.svelte';
	import type { LogBlock, VariableType } from '$lib/types';

	// Import the `load` function result from page.server.ts
	export let data;

	let lessonData = data.lessonData;
	let lessonId = data.lessonId; // Use the lessonId passed from the load function

	// Reactive declaration to update when the route changes
	$: if ($page.params.lessonId !== lessonId) {
		lessonId = $page.params.lessonId;
		lessonData = data.lessonData; // Reassign the new lessonData when the route changes
	}

	// function toggleRun() {
	// 	$isRunning = !$isRunning;
	// }

	// Panel width logic
	let panel1Width = 'lg:w-1/3'; // Initially 1/3 of the screen width
	let panel2Width = 'lg:w-1/3'; // Initially 1/3 of the screen width
	const panel3Width = 'lg:min-w-[450px] lg:w-1/3'; // Fixed width for the third panel

	let isPanel1Collapsed = false;

	// Function to toggle the width of the first panel
	function togglePanel1Width() {
		isPanel1Collapsed = !isPanel1Collapsed;
		panel1Width = isPanel1Collapsed ? 'lg:w-1/6' : 'lg:w-1/3'; // Change to 1/6 when collapsed
		panel2Width = isPanel1Collapsed ? 'lg:w-1/2' : 'lg:w-1/3'; // Expand panel 2 accordingly
	}

	// Function to run the user's code
	async function runner() {
		isRunning.set(true); // Set the running state to true at the start

		for (const block of $snapshot) {
			try {
				if (block.blockType === 'variable') continue;
				if (block.blockType === 'log') await logToConsole(block);
				//if (block.blockType === 'matterAction') await executeMatterAction(block);
			} catch (error: any) {
				// Capture and log error to the Console component
				// Create a new log block with the error message
				const errorBlock: LogBlock = {
					id: Date.now(),
					blockType: 'log',
					message: `Error: ${error.message}`,
					selectedId: null,
					selectedIndex: 0,
					selectedKey: null,
					useIndex: false,
					useKey: false,
					selectedType: 'string',
				};
				consoleOutput.update((output) => [...output, errorBlock]);
			}
		}

		isRunning.set(false); // Set to false when all blocks are processed
	}
</script>

<!-- Panel 1: Tutorial -->
<section
	class="bg-neutral-900 h-screen md:border-r border-zinc-700 lg:border-0 md:w-1/2 overflow-y-scroll transition-all duration-250 ease-in-out {$currentPanel !==
	1
		? 'hidden'
		: ''} {panel1Width} lg:block"
>
	<div class="w-full flex items-center justify-between space-x-4 py-3 px-4 bg-[#ec489a2A]">
		<h2 class="flex items-center py-0 gap-4">
			<FontAwesomeIcon icon={faChalkboardUser} /> Tutorial
		</h2>
		<!-- Toggle Panel 1 width -->
		<button
			type="button"
			class="btn btn-sm py-0 hidden lg:inline-block"
			on:click={togglePanel1Width}
		>
			{#if isPanel1Collapsed}
				<span><FontAwesomeIcon icon={faAngleRight} /></span>
			{:else}
				<span><FontAwesomeIcon icon={faAngleLeft} /></span>
			{/if}
		</button>
	</div>
	{#if lessonData}
		<Tutorial data={lessonData.tutorial} />
	{:else}
		<p>Loading...</p>
	{/if}
</section>

<!-- Panel 2: Editor & Console -->
<section
	class="bg-neutral-900 md:border-r lg:border-x border-zinc-700 h-screen md:w-1/2 overflow-y-scroll transition-all duration-250 ease-in-out {$currentPanel !==
	2
		? 'hidden'
		: ''} {panel2Width} lg:block"
>
	<Accordion>
		<AccordionItem open>
			<svelte:fragment slot="iconClosed"><FontAwesomeIcon icon={faAngleUp} /></svelte:fragment>
			<svelte:fragment slot="iconOpen"><FontAwesomeIcon icon={faAngleDown} /></svelte:fragment>
			<svelte:fragment slot="lead"><FontAwesomeIcon icon={faCode} /></svelte:fragment>
			<svelte:fragment slot="summary">
				<div class="flex justify-between">
					<h2>Editor</h2>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="content">
				{#if lessonData}
					<Editor data={lessonData.editor} />
				{:else}
					<p>Loading...</p>
				{/if}
			</svelte:fragment>
		</AccordionItem>
		<AccordionItem open>
			<svelte:fragment slot="iconClosed"><FontAwesomeIcon icon={faAngleUp} /></svelte:fragment>
			<svelte:fragment slot="iconOpen"><FontAwesomeIcon icon={faAngleDown} /></svelte:fragment>
			<svelte:fragment slot="lead"><FontAwesomeIcon icon={faEye} /></svelte:fragment>
			<svelte:fragment slot="summary"><h2>Console</h2></svelte:fragment>
			<svelte:fragment slot="content">
				<Console data={lessonData.console ? lessonData.console : null} />
			</svelte:fragment>
		</AccordionItem>
	</Accordion>
</section>

<!-- Panel 3: Funnel (matter.js) -->
<section
	class="bg-neutral-900 w-full h-screen md:w-1/2 lg:block transition-all duration-250 ease-in-out {$currentPanel !==
	3
		? 'hidden md:block lg:block'
		: ''} {panel3Width} overflow-y-scroll"
>
	<div
		class="text-start w-full flex items-center justify-between space-x-4 py-2 px-4 bg-[#ec489a2a]"
	>
		<h2 class="flex items-center gap-4"><FontAwesomeIcon icon={faFilter} /> Funnel</h2>
		<button
			type="button"
			on:click={runner}
			disabled={$isRunning}
			class="btn btn-sm bg-primary-900 flex gap-2"
		>
			{#if $isRunning}
				<FontAwesomeIcon icon={faStop} /> Running
			{/if}
			{#if !$isRunning}
				<FontAwesomeIcon icon={faRotateRight} /> Run
			{/if}
		</button>
	</div>
	<!-- Dynamic content start -->
	{#if lessonData}
		<Matter data={lessonData.funnel} />
	{:else}
		<p>Loading...</p>
	{/if}
	<!-- Dynamic content end -->
</section>
