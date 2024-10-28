<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import { faFloppyDisk, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { BooleanVariable } from '$lib/types';
	import { snapshot } from '$lib/store'; // Snapshot store

	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	export let editMode: boolean;
	export let isOpen: boolean;
	export let variableId;
	let variable: BooleanVariable;

	if (variableId !== undefined) {
		variable = $snapshot.find((v) => v.id === variableId) as BooleanVariable;
	} else {
		variable = {
			id: Date.now(),
			name: '',
			type: 'boolean',
			value: 'false',
		};
	}

	const dispatch = createEventDispatcher();

	const closeModal = () => {
		dispatch('close');
	};

	const deleteVariable = () => {
		$snapshot = $snapshot.filter((v) => v.id !== variable.id);
		console.log('Variable deleted', $snapshot);
		dispatch('close');
	};

	const onSave = () => {
		if (editMode) {
			$snapshot = $snapshot.map((v) => (v.id === variable.id ? variable : v));
			console.log('Variable updated', $snapshot);
			dispatch('close');
			return;
		} else {
			// Add variable to snapshot store
			$snapshot = [...$snapshot, variable];
			console.log('New variable added', $snapshot);
		}
		dispatch('close');
	};

	const handleNameChange = (event: Event) => {
		variable.name = (event.target as HTMLInputElement).value;
	};

	const handleValueChange = (event: Event) => {
		variable.value = (event.target as HTMLInputElement).value;
	};
</script>

<Modal {isOpen}>
	<div slot="header" class="card-header flex justify-between items-start">
		<div class="flex flex-col">
			{#if editMode}
				<h3 class="text-sm text-secondary-500">Boolean</h3>{/if}
			<h4 class="text-lg font-semibold">
				{editMode ? variable.name : 'New Boolean'}
			</h4>
		</div>
		<button on:click={closeModal}><FontAwesomeIcon icon={faXmark} /></button>
	</div>
	<form
		slot="content"
		on:submit|preventDefault={onSave}
		class="px-4 flex flex-col gap-4 items-start"
	>
		<!-- Variable Name Input -->
		<label class="label">
			<span>Name</span>
			<input
				class="input"
				type="text"
				bind:value={variable.name}
				on:input={handleNameChange}
				name="name"
				autocomplete="off"
				required
			/>
		</label>
		<!-- Value Input -->
		<div class="flex flex-col gap-1">
			<span>Value</span>
			<RadioGroup>
				<RadioItem
					bind:group={variable.value}
					name="justify"
					value={'true'}
					on:change={handleValueChange}>True</RadioItem
				>
				<RadioItem
					bind:group={variable.value}
					name="justify"
					value={'false'}
					on:change={handleValueChange}>False</RadioItem
				>
			</RadioGroup>
		</div>
		<!-- Hidden Submit Button -->
		<button type="submit" class="sr-only">Submit</button>
	</form>
	<div slot="footer">
		<div class="card-footer flex justify-between">
			{#if editMode}
				<button
					type="button"
					on:click={deleteVariable}
					class="btn btn-sm bg-primary-700 flex gap-2"
				>
					<FontAwesomeIcon icon={faTrash} /> Delete
				</button>
			{:else}
				<div></div>
			{/if}
			<div class="flex">
				<button on:click={closeModal} class="btn"> Cancel </button>
				<button on:click={onSave} class="btn btn-sm bg-secondary-700 flex gap-2">
					<FontAwesomeIcon icon={faFloppyDisk} /> Save
				</button>
			</div>
		</div>
	</div>
</Modal>
