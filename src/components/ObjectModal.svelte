<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import ObjectEdit from './ObjectEdit.svelte';
	import {
		faExclamationTriangle,
		faFloppyDisk,
		faTrash,
		faXmark,
	} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { ObjectVariable } from '$lib/types';
	import { snapshot } from '$lib/stores/snapshots'; // Snapshot store
	import { checkIfDeletable } from '$lib/utils/checkIfDeletable';

	export let editMode: boolean;
	export let isOpen: boolean;
	export let variableId;
	let variable: ObjectVariable;
	let errorMsg: string = '';

	$: _snapshot = $snapshot;

	if (editMode && variableId) {
		// Clone the variable to avoid directly modifying the store object
		variable = { ...$snapshot.find((v) => v.id === variableId) } as ObjectVariable;
	} else {
		// If not in edit mode, create a new variable
		variable = {
			id: Date.now(),
			blockType: 'variable',
			name: '',
			type: 'object',
			value: { key1: '' },
		};
	}

	const dispatch = createEventDispatcher();

	const closeModal = () => {
		dispatch('close');
	};

	const deleteVariable = () => {
		if (!checkIfDeletable(variable.id)) {
			errorMsg = 'This variable is being used in another code block';
			return;
		}
		$snapshot = _snapshot.filter((v) => v.id !== variable.id);
		dispatch('close');
	};

	const onSave = () => {
		// Add default name, if empty
		if (variable.name === '') variable.name = 'new object';
		if (editMode) {
			$snapshot = _snapshot.map((v) => (v.id === variable.id ? variable : v));
			dispatch('close');
			return;
		} else {
			// Add variable to snapshot store
			$snapshot = [..._snapshot, variable];
		}
		dispatch('close');
	};

	const handleNameChange = (event: Event) => {
		variable.name = (event.target as HTMLInputElement).value;
	};

	// Listen for object updates from ObjectEdit component
	const handleObjectUpdate = (updatedObject: any) => {
		variable.value = updatedObject.value;
	};
</script>

<Modal {isOpen} on:close={closeModal}>
	<div slot="header" class="card-header flex justify-between items-start">
		<div class="flex flex-col">
			<!-- Display item type if in edit mode -->
			{#if editMode}
				<h4 class="text-sm text-secondary-500">Object</h4>
			{/if}
			<h4 class="text-lg font-semibold">
				{editMode ? variable.name : 'New Object'}
			</h4>
		</div>
		<button on:click={closeModal}><FontAwesomeIcon icon={faXmark} /></button>
	</div>
	<form
		slot="content"
		on:submit|preventDefault={onSave}
		class="px-2 lg:px-2 flex flex-col gap-4 items-start"
	>
		<!-- Variable Name Input -->
		<label class="label px-2">
			<span>Label</span>
			<input
				class="input"
				type="text"
				bind:value={variable.name}
				on:input={handleNameChange}
				name="name"
				autocomplete="off"
				required
				maxlength="25"
			/>
		</label>
		<!-- Value Input -->
		{#if !editMode}
			<ObjectEdit objectVariable={null} on:update={(e) => handleObjectUpdate(e.detail)} />
		{/if}
		{#if editMode}
			<ObjectEdit
				objectVariable={variable
					? {
							id: Date.now(),
							blockType: 'variable',
							name: '',
							type: 'object',
							value: { ...variable.value },
						}
					: null}
				on:update={(e) => handleObjectUpdate(e.detail)}
			/>
		{/if}
		<!-- Hidden Submit Button -->
		<button type="submit" class="sr-only">Submit</button>
	</form>
	<div slot="footer">
		<div class="card-footer flex flex-col">
			<div class="flex justify-between">
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
			{#if errorMsg !== ''}
				<aside class="alert variant-ghost-error mt-4">
					<p class="flex gap-4 items-center text-sm sm:text-lg">
						<span class="hidden sm:inline-block"
							><FontAwesomeIcon icon={faExclamationTriangle} /></span
						>{errorMsg}
					</p>
				</aside>
			{/if}
		</div>
	</div>
</Modal>
