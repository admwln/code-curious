<script lang="ts">
	import { currentPanel } from '$lib/stores/store';
	import { page } from '$app/stores'; // Store for dynamic routing
	import { afterUpdate } from 'svelte';
	import { fade } from 'svelte/transition';

	import { isRunning } from '$lib/stores/store';
	import { snapshot } from '$lib/stores/snapshots';
	import { actionSnapshot } from '$lib/utils/actions';
	import { clearConsole, consoleOutput, logToConsole } from '$lib/utils/consoleActions';
	import { waitForStability } from '$lib/utils/actions';

	import { executeAction } from '$lib/utils/actions';
	import { supabase } from '$lib/supabaseClient';

	import {
		faAngleUp,
		faAngleDown,
		faAngleLeft,
		faAngleRight,
		faChalkboardUser,
		faCircleExclamation,
		faCode,
		faEye,
		faRotateRight,
		faShapes,
	} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	import Tutorial from '../../../components/Tutorial.svelte';
	import Editor from '../../../components/Editor.svelte';
	import Console from '../../../components/Console.svelte';
	import Matter from '../../../components/Matter.svelte';
	import Accordion from '../../../components/Accordion.svelte';
	import type { LessonData, Log } from '$lib/types';

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

	let showTutorial = false; // Flag to show tutorial after scrolling

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
		showTutorial = false; // Hide tutorial temporarily when the route changes
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

	// RUNNER function to run the user's code
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

		// Wait for stability in matterInstance before ending run
		await waitForStability();
		isRunning.set(false); // Set to false when all blocks are processed and stable
	}

	// Scroll tutorial content to the top when the route changes
	let scrollDiv: HTMLDivElement | null = null;

	// Run after component updates, then scroll and reveal tutorial
	afterUpdate(() => {
		if (scrollDiv) {
			// Scroll to the top
			scrollDiv.scrollTo({ top: 0 });

			// Delay showing the tutorial slightly for smooth transition
			setTimeout(() => {
				showTutorial = true; // Show tutorial after scrolling completes
			}, 500); // Adjust timing if needed for smoother UX
		}
	});

	let consoleExpanded: boolean = false;

	// Function to toggle the console panel
	function toggleConsole() {
		consoleExpanded = !consoleExpanded;
	}
</script>

<!-- Panel 1: Tutorial -->
<section
	class="bg-neutral-900 h-screen transition-all duration-250 ease-in-out flex flex-col {$currentPanel !==
	1
		? 'hidden'
		: ''} {panel1Width} lg:block"
>
	<div bind:this={scrollDiv} class="flex-1 overflow-y-scroll max-h-screen">
		<!-- Panel header -->
		<div
			class="w-full flex items-center justify-between space-x-4 py-3 px-4 bg-[#3a1d2a] sticky top-0 z-10"
		>
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
		<!-- Dynamic content start -->

		{#if lessonData && showTutorial}
			<div in:fade={{ duration: 250 }} out:fade={{ duration: 50 }}>
				<Tutorial data={lessonData.tutorial} />
			</div>
		{/if}
	</div>
</section>

<!-- Panel 2: Editor & Console -->
<section
	class="relative w-full bg-neutral-900 lg:border-x border-zinc-700 h-screen overflow-y-hidden transition-all duration-250 ease-in-out {$currentPanel !==
	2
		? 'hidden'
		: ''} {panel2Width} lg:block"
>
	<!-- Editor -->
	<div>
		<div class="w-full flex items-center justify-between space-x-4 py-3 px-4 bg-[#3a1d2a]">
			<h2 class="flex gap-4 items-center"><FontAwesomeIcon icon={faCode} /> Editor</h2>

			<!-- Run button, only show if currentPanel is 2, that is, not on desktop -->
			<button
				on:click={runner}
				type="button"
				disabled={$isRunning}
				class="btn btn-sm p-0 flex gap-2 {$currentPanel !== 2 ? 'hidden' : ''} lg:hidden"
			>
				{#if $isRunning}
					<FontAwesomeIcon icon={faCircleExclamation} /> Running
				{/if}
				{#if !$isRunning}
					<FontAwesomeIcon icon={faRotateRight} /> Run
				{/if}
			</button>
		</div>
		<!-- Editor content -->
		<div class="p-2">
			{#if lessonData}
				<Editor data={lessonData.editor} />
			{:else}
				<p>Loading...</p>
			{/if}
		</div>
	</div>
	<!-- Console -->
	<div class="w-full absolute bottom-0 z-40">
		<div
			class="w-40 rounded-t-2xl flex items-center justify-between space-x-4 py-3 px-4 bg-[#3a1d2a]"
		>
			<h2 class="flex gap-4 items-center"><FontAwesomeIcon icon={faEye} /> Console</h2>
			<button type="button" on:click={toggleConsole} class="btn btn-sm p-0 flex gap-2">
				{#if consoleExpanded}
					<span><FontAwesomeIcon icon={faAngleDown} /></span>
				{:else}
					<span><FontAwesomeIcon icon={faAngleUp} /></span>
				{/if}
			</button>
		</div>

		<div class="bg-zinc-800 border-t-8 border-[#3a1d2a]">
			<Console expanded={consoleExpanded} />
		</div>
	</div>
</section>

<!-- Panel 3: Playfield -->
<section
	class="bg-neutral-900 w-full h-screen lg:block transition-all duration-250 ease-in-out {$currentPanel !==
	3
		? 'hidden lg:block'
		: ''} {panel3Width} overflow-y-scroll"
>
	<div class="text-start w-full flex items-center justify-between space-x-4 py-2 px-4 bg-[#3a1d2a]">
		<h2 class="flex items-center gap-4"><FontAwesomeIcon icon={faShapes} /> Playfield</h2>
		<button
			type="button"
			on:click={runner}
			disabled={$isRunning}
			class="btn btn-sm bg-primary-900 flex gap-2"
		>
			{#if $isRunning}
				<FontAwesomeIcon icon={faCircleExclamation} /> Running
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
