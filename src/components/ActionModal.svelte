<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import { faFloppyDisk, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { Action, VariableType } from '$lib/types';
	import { snapshot } from '$lib/stores/snapshots'; // Snapshot store

	export let editMode: boolean;
	export let isOpen: boolean;
	export let actionId;
	export let variableId;
	let variable: VariableType;

	// Actions multidimensional array. Each sub-array contains the action name and the type of value it requires.
	const actions: string[][] = [
		['drop', 'string'],
		['increase', 'number'],
	];
	// Available actions for the current variable
	let availableActions: string[][] = actions;

	// Not all actions are associated with a variable
	if (variableId) {
		variable = { ...$snapshot.find((v) => v.id === variableId) };
		// Filter available actions based on the variable type
		availableActions = actions.filter((a) => a[1] === variable.type);
	}
	let action: Action;

	// Snapshot store
	$: _snapshot = $snapshot;

	// If in edit mode, get the action with the given ID
	if (editMode && actionId !== null) {
		// Clone the action to avoid directly modifying the store object
		action = { ...$snapshot.find((a) => a.id === actionId) };
		if (action.variableId) {
			// Get the type of the associated variable
			const type = getVariableType(action.variableId);
			// Filter available actions based on the variable type
			availableActions = actions.filter((a) => a[1] === type);
		}
	}
	// Else if not in edit mode but with existing variableId, create a new action
	else if (!editMode && variableId !== null) {
		action = {
			id: Date.now(),
			blockType: 'action',
			variableId: variableId,
			action: '',
		};
		// Filter available actions based on the variable type
		availableActions = actions.filter((a) => a[1] === variable.type);
	} // Else create a new action without a variable
	else {
		action = {
			id: Date.now(),
			blockType: 'action',
			action: '',
		};
	}

	const dispatch = createEventDispatcher();

	const closeModal = () => {
		dispatch('close');
	};

	const deleteAction = () => {
		$snapshot = _snapshot.filter((a) => a.id !== action.id);
		console.log('Action deleted', $snapshot);
		dispatch('close');
	};

	const onSave = () => {
		if (editMode) {
			$snapshot = _snapshot.map((a) => (a.id === action.id ? action : a));
			dispatch('close');
			return;
		} else {
			// Add action to snapshot store
			$snapshot = [..._snapshot, action];
			console.log('New action added', $snapshot);
		}
		dispatch('close');
	};

	function getVariableType(id: number) {
		const variable = $snapshot.find((v) => v.id === id);
		return variable ? variable.type : '';
	}
</script>

<Modal {isOpen}>
	<div slot="header" class="card-header flex justify-between items-start">
		<div class="flex flex-col">
			<!-- Display item type if in edit mode -->
			{#if editMode}
				<h4 class="text-sm text-secondary-500">Edit Action</h4>
			{:else}<h4 class="text-sm text-secondary-500">{variable.name ? variable.name : ''}</h4>
			{/if}
			<h4 class="text-lg font-semibold">
				{editMode ? action.action : 'New Action'}
			</h4>
		</div>
		<button on:click={closeModal}><FontAwesomeIcon icon={faXmark} /></button>
	</div>
	<form
		slot="content"
		on:submit|preventDefault={onSave}
		class="px-4 flex flex-col gap-4 items-start"
	>
		<!-- Action select -->
		<div class="label">
			<span>Actions</span>
			<select
				name="action"
				class="select"
				bind:value={action.action}
				size={availableActions.length + 1}
			>
				{#each availableActions as action}
					<option value={action[0]}>{action[0]}</option>
				{/each}
			</select>
		</div>
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
