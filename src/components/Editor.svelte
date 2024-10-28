<script lang="ts">
	import { snapshot } from '$lib/store';
	import StringModal from './StringModal.svelte';
	import NumberModal from './NumberModal.svelte';
	import BooleanModal from './BooleanModal.svelte';
	import ArrayModal from './ArrayModal.svelte';
	import NewVariable from './NewVariable.svelte';
	import Accordion from './skeleton/Accordion.svelte';

	export let data;

	// IDs of currently edited variables
	let activeStringId: number | null = null;
	let activeNumberId: number | null = null;
	let activeBooleanId: number | null = null;
	let activeArrayId: number | null = null;

	const handleClose = () => {
		activeStringId = null;
		activeNumberId = null;
		activeBooleanId = null;
		activeArrayId = null;
	};

	console.log('Editor data', data);
</script>

<div class="min-h-[320px] flex flex-col justify-start gap-2">
	<div class="flex flex-col items-start gap-2">
		<!--- Loop through each object in snapshot -->
		{#if $snapshot.length > 0}
			{#each $snapshot as variable (variable.id)}
				<div class="flex rounded-l-full border border-secondary-900 text-sm">
					<div class="bg-secondary-900 rounded-l-full px-2 py-1">{variable.name}</div>

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

	{#if activeArrayId !== null}
		<ArrayModal
			editMode={true}
			isOpen={activeArrayId !== null}
			variableId={activeArrayId}
			on:close={handleClose}
		/>
	{/if}

	<!-- New Variable Creation -->
	<div>
		<NewVariable />
	</div>
</div>
