<script lang="ts">
	import { snapshot } from '$lib/store'; // User code
	import StringModal from './StringModal.svelte';
	import NumberModal from './NumberModal.svelte';
	import BooleanModal from './BooleanModal.svelte';
	import ArrayModal from './ArrayModal.svelte';
	import NewVariable from './NewVariable.svelte';

	export let data; // Data passed from the parent component
	let editString = false;
	let editNumber = false;
	let editBoolean = false;
	let editArray = false;

	const handleClose = () => {
		editString = false;
		editNumber = false;
		editBoolean = false;
		editArray = false;
	};

	console.log('Editor data', data);
</script>

<div class="min-h-[320px] flex flex-col justify-start gap-2">
	<div class="flex flex-col items-start gap-2">
		<!--- loop through each object in shapshot, if any -->
		{#if $snapshot.length > 0}
			{#each $snapshot as variable (variable.id)}
				<div class="flex rounded-l-full border border-secondary-900 text-sm">
					<div class="bg-secondary-900 rounded-l-full px-2 py-1">{variable.name}</div>
					{#if variable.type === 'string'}
						<!-- String -->
						<button
							on:click={() => {
								editString = true;
							}}
							type="button"
							class="btn btn-sm"
							>{variable.value}
						</button>
						{#if editString}
							<StringModal
								editMode={true}
								isOpen={editString}
								variableId={variable.id}
								on:close={handleClose}
							/>
						{/if}
					{/if}
					{#if variable.type === 'number'}
						<!-- Number -->
						<button
							on:click={() => {
								editNumber = true;
							}}
							type="button"
							class="btn btn-sm"
							>{variable.value}
						</button>
						{#if editNumber}
							<NumberModal
								editMode={true}
								isOpen={editNumber}
								variableId={variable.id}
								on:close={handleClose}
							/>
						{/if}
					{/if}
					{#if variable.type === 'boolean'}
						<!-- Boolean -->
						<button
							on:click={() => {
								editBoolean = true;
							}}
							type="button"
							class="btn btn-sm"
							>{variable.value}
						</button>
						{#if editBoolean}
							<BooleanModal
								editMode={true}
								isOpen={editBoolean}
								variableId={variable.id}
								on:close={handleClose}
							/>
						{/if}
					{/if}
					{#if variable.type === 'array'}
						<!-- Array -->
						<button
							on:click={() => {
								editArray = true;
							}}
							type="button"
							class="btn btn-sm"
						>
							<!-- Logic for displaying array items in preview -->
							{#if Array.isArray(variable.value)}
								{#each variable.value as item, i}
									{#if i < variable.value.length - 1}
										{item},{' '}
									{:else}
										{item}{/if}
								{/each}
							{/if}
						</button>
						{#if editArray}
							<ArrayModal
								editMode={true}
								isOpen={editArray}
								variableId={variable.id}
								on:close={handleClose}
							/>
						{/if}
					{/if}
				</div>
			{/each}
		{/if}
	</div>
	<div>
		<NewVariable />
	</div>
</div>
