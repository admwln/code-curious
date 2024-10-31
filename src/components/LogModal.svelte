<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import { faFloppyDisk, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { LogVariable } from '$lib/types';
	import { snapshot } from '$lib/stores/snapshots'; // Snapshot store

	export let editMode: boolean;
	export let isOpen: boolean;
	export let variableId: number | null;

	let variable: LogVariable;
	let selectedObject: Record<string, any> = {};
	let variableCount: number = 0; // To determine if to show the variable selection dropdown
	let arrayLength: number;

	$snapshot.forEach((v) => {
		if (v.blockType === 'variable') {
			variableCount++;
		}
	});
	console.log('Variable count', variableCount);

	if (editMode && variableId) {
		// Clone the variable to avoid directly modifying the store object
		variable = { ...$snapshot.find((v) => v.id === variableId) } as LogVariable;
		// Check if an array is being logged
		if (variable.selectedType === 'array') {
			const selectedVariable = $snapshot.find((v) => v.id === variable.selectedId);
			arrayLength = selectedVariable.value.length;
		}
		// Check if an object is being logged
		if (variable.selectedType === 'object') {
			const selectedVariable = $snapshot.find((v) => v.id === variable.selectedId);
			selectedObject = { ...selectedVariable.value };
		}
	} else {
		// If not in edit mode, create a new variable
		variable = {
			id: Date.now(),
			blockType: 'log',
			selectedId: null,
			selectedIndex: 0,
			selectedKey: null,
			useIndex: false,
			useKey: false,
			displayName: '',
		};
	}

	const dispatch = createEventDispatcher();

	const closeModal = () => {
		dispatch('close');
	};

	const deleteVariable = () => {
		$snapshot = $snapshot.filter((v) => v.id !== variable.id);
		console.log('Console log deleted', $snapshot);
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

	const handleMessageChange = (event: Event) => {
		variable.message = (event.target as HTMLInputElement).value;
	};

	const updateSelectedVariable = () => {
		const selectedVariable = $snapshot.find((v) => v.id === variable.selectedId);
		// Update the selected variable type
		variable.selectedType = selectedVariable.type;
		variable.displayName = selectedVariable.name;
		console.log('Selected variable type', selectedVariable.type);
		// If variable is an array, get the length
		if (selectedVariable.type === 'array') {
			arrayLength = selectedVariable.value.length;
		}
		//If the selected variable is an object, clone it to selectedObject
		if (selectedVariable.type === 'object') {
			selectedObject = { ...selectedVariable.value };
		}
	};
</script>

<Modal {isOpen}>
	<div slot="header" class="card-header flex justify-between items-start">
		<div class="flex flex-col">
			<!-- Display item type if in edit mode -->
			{#if editMode}
				<h4 class="text-sm text-secondary-500">Edit</h4>
			{/if}
			<h4 class="text-lg font-semibold">
				{editMode ? 'Console Log' : 'New Console Log'}
			</h4>
		</div>
		<button on:click={closeModal}><FontAwesomeIcon icon={faXmark} /></button>
	</div>
	<form
		slot="content"
		on:submit|preventDefault={onSave}
		class="px-4 flex flex-col gap-4 items-start"
	>
		<!-- Message Input -->
		<label class="label">
			<span>Message</span>
			<input
				class="input"
				type="text"
				bind:value={variable.message}
				on:input={handleMessageChange}
				name="text"
				placeholder="Hello, World!"
				required
			/>
		</label>
		<!-- Check if there is a variable to log -->
		{#if variableCount > 0}
			<div class="flex gap-4">
				<!-- Select variable to log -->
				<div class="label">
					<span>Variable</span>
					<!-- Select Dropdown: when a variable to log is selected (by id), we need
			 to look up that variable in $snapshot to determine its type -->
					<select
						name="variable"
						class="select"
						bind:value={variable.selectedId}
						on:change={updateSelectedVariable}
					>
						{#each $snapshot as snap (snap.id)}
							<!-- Exclude variables of type log -->
							{#if snap.blockType !== 'log'}
								<option value={snap.id}>{snap.name}</option>
							{/if}
						{/each}
					</select>
				</div>
				{#if variable.selectedType === 'array'}
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" bind:checked={variable.useIndex} />
						<p>Use index</p>
					</label>
				{/if}
				{#if variable.selectedType === 'object'}
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" bind:checked={variable.useKey} />
						<p>Use key</p>
					</label>
				{/if}
			</div>
		{/if}
		<!-- Index Input -->
		{#if variable.selectedType === 'array' && variable.useIndex}
			<label class="label w-20">
				<span>Index</span>
				<input
					class="input"
					type="number"
					min="0"
					max={arrayLength - 1}
					bind:value={variable.selectedIndex}
					name="index"
				/>
			</label>
		{/if}
		<!-- Key selection -->
		{#if variable.selectedType === 'object' && variable.useKey}
			<div class="label">
				<span>Key</span>
				<!-- Select Dropdown: when an object is selected for console logging, and the user has opted to specify a key to log, we need to display the available keys -->
				<select
					name="key"
					class="select"
					bind:value={variable.selectedKey}
					size={Object.keys(selectedObject).length}
				>
					{#each Object.entries(selectedObject) as [key]}
						<option value={key}>{key}</option>
					{/each}
				</select>
			</div>
		{/if}
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
