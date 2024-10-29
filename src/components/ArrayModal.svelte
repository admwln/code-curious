<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import ObjectEdit from './ObjectEdit.svelte';
	import {
		faAngleDown,
		faAngleUp,
		faFloppyDisk,
		faMinus,
		faPlus,
		faTrash,
		faXmark,
	} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { ArrayVariable } from '$lib/types';
	import { snapshot } from '$lib/stores/snapshots'; // Snapshot store

	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	export let editMode: boolean;
	export let isOpen: boolean;
	export let variableId;
	let variable: ArrayVariable;
	let itemCount = 1;
	let array: any[] = [];

	//If array of booleans, store as strings temporarily and convert to booleans on save
	let _boolStringArray: string[] = [];

	if (variableId) {
		variable = $snapshot.find((v) => v.id === variableId) as ArrayVariable;
		itemCount = variable.value.length;
		array = variable.value;
		// Convert booleans to strings temporarily, if variable to be edited has item type boolean
		if (variable.itemType === 'boolean') {
			_boolStringArray = variable.value.map((v) => v.toString());
		}
	} else {
		variable = {
			id: Date.now(),
			name: '',
			type: 'array',
			itemType: 'string',
			value: [],
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
		if (variable.itemType !== 'boolean') {
			// Update variable value
			variable.value = array;
		} else {
			// Convert strings to booleans
			variable.value = _boolStringArray.map((v) => v === 'true');
		}
		// Update snapshot store
		if (!editMode) {
			// Add new variable to snapshot store, if not in edit mode
			$snapshot = [...$snapshot, variable];
			console.log('New variable added', $snapshot);
		} else {
			// Update existing variable in snapshot store
			$snapshot = $snapshot.map((v) => (v.id === variable.id ? variable : v));
			console.log('Variable updated', $snapshot);
		}
		dispatch('close');
	};

	const handleNameChange = (event: Event) => {
		variable.name = (event.target as HTMLInputElement).value;
	};

	const handleItemDataTypeChange = (event: Event) => {
		variable.itemType = (event.target as HTMLInputElement).value;
		// Reset itemCount and array if item type is changed
		itemCount = 1;
		array = [];
		// Reset _boolStringArray if item type is boolean
		if (variable.itemType === 'boolean') {
			_boolStringArray = ['false'];
		}
	};

	const handleRemoveItem = () => {
		itemCount -= 1;
		if (variable.itemType !== 'boolean') {
			array.pop();
		} else {
			_boolStringArray.pop();
		}
	};

	// Listen for object updates from ObjectEdit component
	const handleObjectUpdate = (index: number, updatedObject: any) => {
		array[index] = updatedObject.value;
	};
</script>

<Modal {isOpen}>
	<div slot="header" class="card-header flex justify-between items-start">
		<div class="flex flex-col">
			<!-- Display item type if in edit mode -->
			{#if editMode}
				<h3 class="text-sm text-secondary-500">Array of {variable.itemType}s</h3>
			{/if}
			<h4 class="text-lg font-semibold">
				{editMode ? variable.name : 'New Array'}
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

		<!-- Item Data Type -->
		{#if !editMode}
			<div class="flex flex-col gap-1">
				<span>Item Data Type</span>
				<RadioGroup>
					<RadioItem
						class="text-sm px-1.5"
						bind:group={variable.itemType}
						name="justify"
						value={'string'}
						on:change={handleItemDataTypeChange}>String</RadioItem
					>
					<RadioItem
						class="text-sm  px-1.5"
						bind:group={variable.itemType}
						name="justify"
						value={'number'}
						on:change={handleItemDataTypeChange}>Number</RadioItem
					>
					<RadioItem
						class="text-sm  px-1.5"
						bind:group={variable.itemType}
						name="justify"
						value={'boolean'}
						on:change={handleItemDataTypeChange}>Boolean</RadioItem
					>
					<RadioItem
						class="text-sm px-1.5"
						bind:group={variable.itemType}
						name="justify"
						value={'object'}
						on:change={handleItemDataTypeChange}>Object</RadioItem
					>
				</RadioGroup>
			</div>
		{/if}
		<!-- Add/Remove items -->
		<div class="flex gap-2">
			<button
				type="button"
				on:click={() => {
					itemCount += 1;
				}}
				class="btn btn-sm bg-secondary-700 flex gap-2"
				><FontAwesomeIcon icon={faPlus} /> Add item</button
			>
			<button type="button" on:click={handleRemoveItem} class="btn btn-sm bg-primary-700 flex gap-2"
				><FontAwesomeIcon icon={faMinus} /> Remove item</button
			>
		</div>

		{#if variable.itemType === 'string'}
			{#each { length: itemCount } as _, i}
				<label class="label flex flex-row items-center gap-2">
					<span>{i}</span>
					<input
						bind:value={array[i]}
						class="input"
						type="text"
						name="name"
						autocomplete="off"
						required
					/>
				</label>
			{/each}
		{/if}
		{#if variable.itemType === 'number'}
			{#each { length: itemCount } as _, i}
				<label class="label flex flex-row items-center gap-2">
					<span>{i}</span>
					<input
						bind:value={array[i]}
						class="input"
						type="number"
						name="number"
						autocomplete="off"
						required
					/>
				</label>
			{/each}
		{/if}
		{#if variable.itemType === 'boolean'}
			{#each { length: itemCount } as _, i}
				<div class="label flex flex-row items-center gap-2">
					<span>{i}</span>
					<RadioGroup>
						<RadioItem bind:group={_boolStringArray[i]} name="justify" value="true">True</RadioItem>
						<RadioItem bind:group={_boolStringArray[i]} name="justify" value="false"
							>False</RadioItem
						>
					</RadioGroup>
				</div>
			{/each}
		{/if}
		{#if variable.itemType === 'object'}
			<div class="w-full flex flex-col gap-4">
				{#each { length: itemCount } as _, i}
					<!-- Accordion -->
					<div class="w-full">
						<div class="rounded-t-xl flex justify-between p-2 bg-surface-200-700-token mb-2">
							<h4>Object {i}</h4>
							<button type="button" class="btn btn-sm"
								><FontAwesomeIcon icon={faAngleDown} /></button
							>
						</div>
						<div>
							{#if !editMode}
								<ObjectEdit
									objectVariable={null}
									on:update={(e) => handleObjectUpdate(i, e.detail)}
								/>
							{/if}
							{#if editMode}
								<ObjectEdit
									objectVariable={array[i]
										? {
												id: Date.now(),
												name: '',
												type: 'object',
												value: { ...array[i] },
											}
										: null}
									on:update={(e) => handleObjectUpdate(i, e.detail)}
								/>
							{/if}
						</div>
						<div class="p-0.5 bg-surface-200-700-token mt-3"></div>
					</div>
				{/each}
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
