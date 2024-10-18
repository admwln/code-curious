<script lang="ts">
	import { currentPanel } from '$lib/store';
	import { isRunning } from '$lib/store';
	import { page } from '$app/stores'; // Store for dynamic routing

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

	import Matter from '../../../components/Matter.svelte';
	import Accordion from '../../../components/skeleton/Accordion.svelte';
	import AccordionItem from '../../../components/skeleton/AccordionItem.svelte';

	// Import the `load` function result from page.server.ts
	export let data;

	let lessonData = data.lessonData;
	let lessonId = data.lessonId; // Use the lessonId passed from the load function

	// Reactive declaration to update when the route changes
	$: if ($page.params.lessonId !== lessonId) {
		lessonId = $page.params.lessonId;
		lessonData = data.lessonData; // Reassign the new lessonData when the route changes
	}

	function toggleRun() {
		$isRunning = !$isRunning;
	}
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
			<p>
				<a class="anchor" href={`/tutorial/${lessonData.tutorial.nextLesson}`}>Next lesson</a>
			</p>
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
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
