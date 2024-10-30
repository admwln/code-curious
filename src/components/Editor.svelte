<script lang="ts">
	import StringModal from './StringModal.svelte';
	import NumberModal from './NumberModal.svelte';
	import BooleanModal from './BooleanModal.svelte';
	import ObjectModal from './ObjectModal.svelte';
	import ArrayModal from './ArrayModal.svelte';
	import NewVariable from './NewVariable.svelte';
	import LogModal from './LogModal.svelte';
	import NewLog from './NewLog.svelte';

	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	// START: New logic for loading and saving snapshots--------------------------------
	import { snapshot, saveSnapshot, loadSnapshot, resetSnapshot } from '$lib/stores/snapshots';
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;
	let lessonId: string;

	// Subscribe to the lessonId from the page store
	$: lessonId = $page.params.lessonId;

	// Load snapshot data for the current lesson when the component mounts or lessonId changes
	$: {
		if (lessonId) {
			loadSnapshot(lessonId);
		}
	}

	// Save the current snapshot before navigating to another route
	beforeNavigate(() => {
		if (lessonId) {
			saveSnapshot(lessonId, $snapshot);
		}
	});

	// Reset snapshot on initial load for a fresh start
	// Possibly not needed
	//onMount(() => {
	//console.log('Editor mounted, resetting snapshot');
	//$snapshot = [];
	//resetSnapshot();
	//});
	// END -------------------------------------------------------------------------

	// IDs of currently edited variables
	let activeStringId: number | null = null;
	let activeNumberId: number | null = null;
	let activeBooleanId: number | null = null;
	let activeObjectId: number | null = null;
	let activeArrayId: number | null = null;
	let activeLogId: number | null = null;

	const handleClose = () => {
		activeStringId = null;
		activeNumberId = null;
		activeBooleanId = null;
		activeObjectId = null;
		activeArrayId = null;
		activeLogId = null;
	};

	console.log('Editor data', data);
</script>

<div class="min-h-[320px] flex flex-col justify-start gap-4">
	<div class="flex flex-col items-start gap-2">
		<!--- Loop through each object in snapshot -->
		{#if $snapshot.length > 0}
			{#each $snapshot as variable (variable.id)}
				<div class="flex rounded-l-full border border-secondary-900 text-sm">
					<div class="bg-secondary-900 rounded-l-full px-2 py-1">
						{variable.name ? variable.name : 'Console Log'}
					</div>

					<!-- String Variable -->
					{#if variable.type === 'string'}
						<button
							on:click={() => {
								activeStringId = variable.id;
							}}
							type="button"
							class="btn btn-sm"
						>
							{variable.value}
						</button>
					{/if}

					<!-- Number Variable -->
					{#if variable.type === 'number'}
						<button
							on:click={() => {
								activeNumberId = variable.id;
							}}
							type="button"
							class="btn btn-sm"
						>
							{variable.value}
						</button>
					{/if}

					<!-- Boolean Variable -->
					{#if variable.type === 'boolean'}
						<button
							on:click={() => {
								activeBooleanId = variable.id;
							}}
							type="button"
							class="btn btn-sm"
						>
							{variable.value}
						</button>
					{/if}
					<!-- Object Variable -->
					{#if variable.type === 'object'}
						<button
							on:click={() => {
								activeObjectId = variable.id;
							}}
							type="button"
							class="btn btn-sm"
						>
							{JSON.stringify(variable.value).substring(0, 30)} ...
						</button>
					{/if}

					<!-- Array Variable -->
					{#if variable.type === 'array'}
						<button
							on:click={() => {
								activeArrayId = variable.id;
							}}
							type="button"
							class="btn btn-sm"
						>
							{#if Array.isArray(variable.value)}
								{#each variable.value as item, i}
									{#if typeof item === 'object' && i === 0}
										{JSON.stringify(item).substring(0, 30)} ...
									{:else if typeof item !== 'object'}
										{#if i < variable.value.length - 1}
											{item},{' '}
										{:else}
											{item}
										{/if}
									{/if}
								{/each}
							{/if}
						</button>
					{/if}
					<!-- Log block -->
					{#if variable.type === 'log'}
						<button
							on:click={() => {
								activeLogId = variable.id;
							}}
							type="button"
							class="btn btn-sm"
						>
							{variable.useKey ? variable.selectedKey + ' of ' : ''}
							{variable.message ? variable.message : variable.displayName}
							{variable.useIndex ? ' at index ' + variable.selectedIndex : ''}
						</button>
					{/if}
				</div>
			{/each}
		{/if}
	</div>

	<!-- Modals for Editing Variables -->
	{#if activeStringId !== null}
		<StringModal
			editMode={true}
			isOpen={activeStringId !== null}
			variableId={activeStringId}
			on:close={handleClose}
		/>
	{/if}

	{#if activeNumberId !== null}
		<NumberModal
			editMode={true}
			isOpen={activeNumberId !== null}
			variableId={activeNumberId}
			on:close={handleClose}
		/>
	{/if}

	{#if activeBooleanId !== null}
		<BooleanModal
			editMode={true}
			isOpen={activeBooleanId !== null}
			variableId={activeBooleanId}
			on:close={handleClose}
		/>
	{/if}

	{#if activeObjectId !== null}
		<ObjectModal
			editMode={true}
			isOpen={activeObjectId !== null}
			variableId={activeObjectId}
			on:close={handleClose}
		/>
	{/if}

	{#if activeArrayId !== null}
		<ArrayModal
			editMode={true}
			isOpen={activeArrayId !== null}
			variableId={activeArrayId}
			on:close={handleClose}
		/>
	{/if}

	{#if activeLogId !== null}
		<LogModal
			editMode={true}
			isOpen={activeLogId !== null}
			variableId={activeLogId}
			on:close={handleClose}
		/>
	{/if}

	<!-- In the following section, the user can choose to create a new variable,
	 a new console log, etc -->
	<section class="flex flex-col gap-2 items-start">
		<div>
			<NewVariable />
		</div>
		<div>
			<NewLog />
		</div>
	</section>
</div>
