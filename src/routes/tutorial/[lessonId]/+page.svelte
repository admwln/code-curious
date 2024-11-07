<script lang="ts">
	import { currentPanel } from '$lib/stores/store';
	import { page } from '$app/stores'; // Store for dynamic routing
	// Imports for runner function:
	import { isRunning } from '$lib/stores/store';
	import { snapshot } from '$lib/stores/snapshots';
	import { actionSnapshot } from '$lib/utils/actions';
	import { clearConsole, consoleOutput, logToConsole } from '$lib/utils/consoleActions';

	import { executeAction } from '$lib/utils/actions';
	import { supabase } from '$lib/supabaseClient';

	import {
		faAngleLeft,
		faAngleRight,
		faChalkboardUser,
		faCode,
		faEye,
		faFilter,
		faRotateRight,
		faShapes,
		faStop,
	} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	import Tutorial from '../../../components/Tutorial.svelte';
	import Editor from '../../../components/Editor.svelte';
	import Console from '../../../components/Console.svelte';
	import Matter from '../../../components/Matter.svelte';
	import Accordion from '../../../components/Accordion.svelte';
	import type { LessonData, Log } from '$lib/types';

	// Import the `load` function result from +page.server.ts:
	// NB not used in this file, as lesson data is loaded in the script block
	//export let data;

	//let lessonId = data.lessonId; // Use the lessonId passed from the load function
	let lessonId = $page.params.lessonId; // Use the lessonId from the route params
	let lessonData: LessonData = {
		tutorial: {
			title: '',
			content: [''],
			prevLesson: '',
			nextLesson: '',
		},
		editor: {
			snapshot: [],
		},
		playfiled: {},
	};

	// Use Supabase client to fetch data from countries table
	const fetchLesson = async () => {
		const { data, error } = await supabase
			.from('lessons')
			.select('*')
			.eq('slug', lessonId)
			.single();
		if (error) {
			console.error('Error fetching data', error);
		}
		//console.log(data);
		lessonData.tutorial = {
			title: data.title,
			content: data.content,
			prevLesson: data.prev_lesson,
			nextLesson: data.next_lesson,
		};
		if (data.snapshot) {
			lessonData.editor = {
				snapshot: data.snapshot,
			};
		} else {
			lessonData.editor = {
				snapshot: [],
			};
		}
	};
	fetchLesson();

	// Reactive declaration to update when the route changes
	$: if ($page.params.lessonId !== lessonId) {
		lessonId = $page.params.lessonId;
		//lessonData = data.lessonData; // Reassign the new lessonData when the route changes
		clearConsole(); // Clear the console when the route changes
		fetchLesson();
	}

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

	// // Reactive statement to update actionSnapshot any time $snapshot changes
	// $: {
	// 	$actionSnapshot = structuredClone($snapshot); // Deep clone $snapshot each time it updates
	// }

	// Function to run the user's code
	async function runner() {
		$actionSnapshot = structuredClone($snapshot); // Deep clone $snapshot
		isRunning.set(true); // Set the running state to true at the start
		for (const block of $actionSnapshot) {
			// If the current block has a variableId associated with it, create a deep clone of the variable
			let variable = null;

			// // Action blocks can have a variableId associated with them
			// if (block.blockType === 'action' && block.variableId) {
			// 	variable = structuredClone($actionSnapshot.find((v) => v.id === block.variableId));
			// }
			// Log blocks can have a selectedId associated with them
			if (block.blockType === 'log' && block.selectedId) {
				variable = structuredClone($actionSnapshot.find((v) => v.id === block.selectedId));
			}

			try {
				if (block.blockType === 'variable') continue;
				if (block.blockType === 'log') await logToConsole(block, variable);
				if (block.blockType === 'action') await executeAction(block);
			} catch (error: any) {
				// Capture and log error to the Console component
				// Create a new log block with the error message
				const errorBlock: Log = {
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
	<Accordion open={true} topBorder={false} rounded={false} color={'bg-[#ec489a2A]'}>
		<div slot="summary">
			<h2 class="flex gap-4 items-center"><FontAwesomeIcon icon={faCode} /> Editor</h2>
		</div>
		<div slot="content" class="p-2">
			{#if lessonData}
				<Editor data={lessonData.editor} />
			{:else}
				<p>Loading...</p>
			{/if}
		</div>
	</Accordion>
	<Accordion open={true} topBorder={true} rounded={false} color={'bg-[#ec489a2A]'}>
		<div slot="summary">
			<h2 class="flex gap-4 items-center"><FontAwesomeIcon icon={faEye} /> Console</h2>
		</div>
		<div slot="content" class="p-2">
			<Console />
		</div>
	</Accordion>
</section>

<!-- Panel 3: Playfield -->
<section
	class="bg-neutral-900 w-full h-screen md:w-1/2 lg:block transition-all duration-250 ease-in-out {$currentPanel !==
	3
		? 'hidden md:block lg:block'
		: ''} {panel3Width} overflow-y-scroll"
>
	<div
		class="text-start w-full flex items-center justify-between space-x-4 py-2 px-4 bg-[#ec489a2a]"
	>
		<h2 class="flex items-center gap-4"><FontAwesomeIcon icon={faShapes} /> Playfield</h2>
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
		<Matter data={lessonData.playfiled} />
	{:else}
		<p>Loading...</p>
	{/if}
	<!-- Dynamic content end -->
</section>
