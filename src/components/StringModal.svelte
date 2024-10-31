<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import { faFloppyDisk, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { StringVariable } from '$lib/types';
	import { snapshot } from '$lib/stores/snapshots'; // Snapshot store

	export let editMode: boolean;
	export let isOpen: boolean;
	export let variableId;
	console.log('StringModal', variableId);

	let variable: StringVariable;

	if (editMode && variableId !== undefined) {
		// Clone the variable to avoid directly modifying the store object
		variable = { ...$snapshot.find((v) => v.id === variableId) } as StringVariable;
	} else {
		// If not in edit mode, create a new variable
		variable = {
			id: Date.now(),
			blockType: 'variable',
			name: '',
			type: 'string',
			value: '',
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
			<!-- Display item type if in edit mode -->
			{#if editMode}
				<h4 class="text-sm text-secondary-500">String</h4>
			{/if}
			<h4 class="text-lg font-semibold">
				{editMode ? variable.name : 'New String'}
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
		<label class="label">
			<span>Value</span>
			<input
				class="input"
				type="text"
				bind:value={variable.value}
				on:input={handleValueChange}
				name="text"
				required
			/>
		</label>
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
