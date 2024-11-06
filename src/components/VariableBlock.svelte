<script lang="ts">
	import ActionModal from './ActionModal.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faBolt } from '@fortawesome/free-solid-svg-icons';

	// Props for block details and functions to handle activation
	export let block;
	export let onActivate: () => void;
	export let showActionButton = false;

	let isOpen: boolean = false;

	const openAction = () => {
		isOpen = true;
	};

	const closeAction = () => {
		isOpen = false;
	};
</script>

<div class="flex border border-secondary-900 text-sm">
	<div class="bg-secondary-900 px-2 py-1 flex gap-2 items-center">
		{block.name}
	</div>

	<button on:click={onActivate} type="button" class="btn btn-sm">
		{#if block.type === 'object'}
			{JSON.stringify(block.value).substring(0, 30)} ...
		{:else if block.type === 'array'}
			{#if Array.isArray(block.value)}
				{#each block.value as item, i}
					{#if typeof item === 'object' && i === 0}
						{JSON.stringify(item).substring(0, 30)} ...
					{:else if typeof item !== 'object'}
						{#if i < block.value.length - 1}
							{item},{' '}
						{:else}
							{item}
						{/if}
					{/if}
				{/each}
			{/if}
		{:else}
			{block.value}
		{/if}
	</button>

	{#if showActionButton}
		<button on:click={openAction} type="button" class="btn btn-sm">
			<FontAwesomeIcon icon={faBolt} /> <span class="sr-only">Add Action</span>
		</button>
	{/if}
</div>

{#if isOpen}
	<ActionModal
		editMode={false}
		{isOpen}
		variableId={block.id}
		actionId={null}
		on:close={closeAction}
	/>
{/if}
