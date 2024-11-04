<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import { faFloppyDisk, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { Action, VariableType } from '$lib/types';
	import { snapshot } from '$lib/stores/snapshots'; // Snapshot store

	export let editMode: boolean;
	export let isOpen: boolean;
	export let variableId;
	export let actionId;
	export let handleClose: () => void;
	// There should always be a variable, because an action is always associated with a variable
	let variable: VariableType = { ...$snapshot.find((v) => v.id === variableId) };
	let action: Action;

	// Snapshot store
	$: _snapshot = $snapshot;

	// If in edit mode, get the action with the given ID
	if (editMode && actionId !== null) {
		// Clone the action to avoid directly modifying the store object
		action = { ...$snapshot.find((a) => a.id === actionId) };
	} // If not in edit mode, create a new action
	else {
		console.log('Creating new action');
		action = {
			id: Date.now(),
			blockType: 'action',
			variableId: variableId,
			action: '',
			name: '',
		};
	}

	const dispatch = createEventDispatcher();

	const closeModal = () => {
		handleClose();
		dispatch('close');
	};

	const deleteAction = () => {
		$snapshot = _snapshot.filter((a) => a.id !== action.id);
		dispatch('close');
	};

	const onSave = () => {
		if (editMode) {
			$snapshot = _snapshot.map((a) => (a.id === action.id ? action : a));
			handleClose();
			dispatch('close');
			return;
		} else {
			// Add action to snapshot store
			$snapshot = [..._snapshot, action];
			console.log('New action added', $snapshot);
		}
		handleClose();
		dispatch('close');
	};

	const handleNameChange = (event: Event) => {
		action.name = (event.target as HTMLInputElement).value;
	};

	const handleValueChange = (event: Event) => {
		action.action = (event.target as HTMLInputElement).value;
	};
</script>

<Modal {isOpen}>
	<div slot="header" class="card-header flex justify-between items-start">
		<div class="flex flex-col">
			<!-- Display item type if in edit mode -->
			{#if editMode}
				<h4 class="text-sm text-secondary-500">Action</h4>
			{:else}<h4 class="text-sm text-secondary-500">{variable.name}</h4>
			{/if}
			<h4 class="text-lg font-semibold">
				{editMode ? action.name : 'New Action'}
			</h4>
		</div>
		<button on:click={closeModal}><FontAwesomeIcon icon={faXmark} /></button>
	</div>
	<form
		slot="content"
		on:submit|preventDefault={onSave}
		class="px-4 flex flex-col gap-4 items-start"
	>
		<!-- Action Name Input -->
		<label class="label">
			<span>Name</span>
			<input
				class="input"
				type="text"
				bind:value={action.name}
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
				bind:value={action.action}
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
				<button type="button" on:click={deleteAction} class="btn btn-sm bg-primary-700 flex gap-2">
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
