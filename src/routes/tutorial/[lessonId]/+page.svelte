<script lang="ts">
	import { currentPanel } from '$lib/store';
	import { isRunning } from '$lib/store';
	import { page } from '$app/stores'; // For dynamic routing
	import { onDestroy } from 'svelte';

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

	// Import components
	import Matter from '../../../components/Matter.svelte';

	// Modified skeleton components
	import Accordion from '../../../components/skeleton/Accordion.svelte';
	import AccordionItem from '../../../components/skeleton/AccordionItem.svelte';

	// Keep track of if the simulation is running
	function toggleRun() {
		$isRunning = !$isRunning;
	}

	interface LessonData {
		tutorial: {
			title: string;
			description: string;
			topics: { name: string }[];
			exampleCode: string;
		};
		editor: {
			defaultCode: string;
		};
		console: {
			defaultCode: string;
		};
		funnel: {
			color: string;
		};
	}

	let lessonData: LessonData | null = null;
	let lessonId = '';

	// Example of locally stored lessons data
	const lessons: { [key: string]: LessonData } = {
		'welcome-to-funnel': {
			tutorial: {
				title: 'Welcome to Funnel Logic!',
				description: 'This is the starting point of the tutorial.',
				topics: [{ name: 'Introduction' }, { name: 'Getting started' }],
				exampleCode: 'console.log("Hello, World!");',
			},
			editor: {
				defaultCode: 'Here you will find all the code blocks!',
			},
			console: {
				defaultCode: "console.log('Hello, World!');",
			},
			funnel: {
				color: 'hotpink',
			},
		},
		'lesson-1': {
			tutorial: {
				title: 'Lesson 1: Introduction to Variables',
				description: 'In this lesson, we will cover basic variable declarations.',
				topics: [
					{ name: 'What is a variable?' },
					{ name: 'Variable types' },
					{ name: 'Declaring variables' },
				],
				exampleCode: 'let x = 5;\nlet y = 10;\nconsole.log(x + y);',
			},
			editor: {
				defaultCode: 'Here you will find all the code blocks!',
			},
			console: {
				defaultCode: "console.log('Hello, World!');",
			},
			funnel: {
				color: 'seagreen',
			},
		},
		'lesson-2': {
			tutorial: {
				title: 'Lesson 2: Introduction to Functions',
				description: 'In this lesson, we will cover basic function declarations.',
				topics: [
					{ name: 'What is a function?' },
					{ name: 'Function syntax' },
					{ name: 'Calling functions' },
				],
				exampleCode: 'function add(x, y) {\n\treturn x + y;\n}\nconsole.log(add(5, 10));',
			},
			editor: {
				defaultCode: 'Here you will find all the code blocks!',
			},
			console: {
				defaultCode: "console.log('Hello, World!');",
			},
			funnel: {
				color: 'gold',
			},
		},
	};

	// Subscribe to the `page` store to get the current route parameters
	const unsubscribe = page.subscribe(({ params }) => {
		lessonId = params.lessonId; // `lessonId` is a dynamic route param
		lessonData = lessons[lessonId] || null; // Fetch the lesson data or set to null if not found
	});

	// Unsubscribe when the component is destroyed to avoid memory leaks
	onDestroy(() => {
		unsubscribe();
	});
</script>

<!-- Panel 1: Tutorial -->
<section
	class="bg-neutral-900 md:mr-0.5 lg:mx-0 w-full h-screen md:w-1/2 lg:w-1/3 lg:block {$currentPanel !==
	1
		? 'hidden'
		: ''} overflow-y-scroll"
>
	<h2 class="text-start w-full flex items-center gap-4 space-x-4 py-3 px-4 bg-[#ec489a2A]">
		<FontAwesomeIcon icon={faChalkboardUser} /> Tutorial
	</h2>
	<!-- Dynamic content start -->
	<div class="p-4">
		{#if lessonData}
			<h1>{lessonData.tutorial.title}</h1>
			<p>{lessonData.tutorial.description}</p>
			<ul>
				{#each lessonData.tutorial.topics as topic}
					<li>{topic.name}</li>
				{/each}
			</ul>
			<code>{lessonData.tutorial.exampleCode}</code>
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
	<!-- Dynamic content end -->
</section>

<!-- Panel 2: Editor & Console -->
<section
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
			<svelte:fragment slot="content">
				<!-- Dynamic content start -->
				{#if lessonData}
					<code>{lessonData.editor.defaultCode}</code>
				{/if}
				<!-- Dynamic content end -->
			</svelte:fragment>
		</AccordionItem>
		<AccordionItem open>
			<svelte:fragment slot="iconClosed"><FontAwesomeIcon icon={faMinus} /></svelte:fragment>
			<svelte:fragment slot="iconOpen"><FontAwesomeIcon icon={faPlus} /></svelte:fragment>
			<svelte:fragment slot="lead"><FontAwesomeIcon icon={faDesktop} /></svelte:fragment>
			<svelte:fragment slot="summary"><h2>Console</h2></svelte:fragment>
			<svelte:fragment slot="content">
				<!-- Dynamic content start -->
				<div class="rounded-md bg-slate-800 p-4">
					{#if lessonData}
						<code>{lessonData.console.defaultCode}</code>
					{/if}
				</div>
				<!-- Dynamic content end -->
			</svelte:fragment>
		</AccordionItem>
	</Accordion>
</section>

<!-- Panel 3: Funnel (matter.js) -->
<section
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
	<!-- Dynamic content start -->
	<Matter />
	<!-- Dynamic content end -->
</section>
