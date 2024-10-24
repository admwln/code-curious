<script lang="ts">
	import type { VariableType } from '$lib/types';
	// Import the snapshot store
	import { snapshot } from '$lib/store';

	import Modal from './Modal.svelte';

	// Props, data holds the variable object
	export let data: VariableType;

	let showModal = false;
	function openModal() {
		showModal = true;
	}
	function closeModal() {
		showModal = false;
	}

	let variableId: number = data.id; // Holds the variable's ID
	let variableName: string = data.name; // Holds the variable's name
	let dataType: string = data.type; // Default data type is 'Text' (1)
	let value: string | number | boolean = data.value; // Holds the value input

	// Handle change in the data type
	function handleDataTypeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		dataType = target.value;

		// Reset value when changing data type
		if (dataType === 'text') {
			value = ''; // For text
		} else if (dataType === 'number') {
			value = 0; // For number
		} else if (dataType === 'bool') {
			value = false; // For boolean
		}
	}

	// Function to handle form submission
	function updateVariable() {
		const variable = {
			id: variableId,
			name: variableName,
			type: dataType,
			value: value,
		};
		// Do something with the variable (e.g., send to a server, store in state)
		// Replace the existing variable in the snapshot store
		$snapshot = $snapshot.map((v) => (v.id === variableId ? variable : v));
		//console.log('Variable updated in snapshot store:', $snapshot);
		closeModal();
	}

	function deleteVariable() {
		// Filter out the variable with the current ID
		$snapshot = $snapshot.filter((v) => v.id !== variableId);
		//console.log('Variable deleted:', $snapshot);
		closeModal();
	}
</script>

<div class="flex rounded-full border border-secondary-900 text-sm">
	<div class="bg-secondary-900 rounded-l-full px-2 py-1">{data.name}</div>
	<button on:click={openModal} type="button" class="btn btn-sm">{data.value}</button>
</div>

<Modal
	bind:header={variableName}
	isOpen={showModal}
	on:close={closeModal}
	formId="editVariable"
	deleteFunction={deleteVariable}
>
	<form
		id="editVariable"
		on:submit|preventDefault={updateVariable}
		class="px-4 flex flex-col gap-4 items-start"
	>
		<!-- Variable Name Input -->
		<label class="label">
			<span>Name</span>
			<input
				class="input"
				type="text"
				placeholder="Name"
				bind:value={variableName}
				name="name"
				autocomplete="off"
				required
			/>
		</label>

		<!-- Data Type Selector -->
		<label class="label">
			<span>Data type</span>
			<select class="select" bind:value={dataType} on:change={handleDataTypeChange} name="dataType">
				<option value="text">Text</option>
				<option value="number">Number</option>
				<option value="bool">Boolean</option>
			</select>
		</label>

		<!-- Conditional Value Input -->
		{#if dataType === 'text'}
			<label class="label">
				<!-- Text input for 'Text' type -->
				<span>Value</span>
				<input class="input" type="text" placeholder="Value" bind:value name="text" required />
			</label>
		{:else if dataType === 'number'}
			<!-- Number input for 'Number' type -->
			<label class="label flex flex-col">
				<span>Value</span>
				<input
					class="input w-24"
					type="number"
					min="0"
					max="9999"
					bind:value
					name="number"
					required
				/>
			</label>
		{:else if dataType === 'bool'}
			<!-- Radio buttons for 'Boolean' type -->
			<label class="label">
				<span>Value</span>
				<div class="flex gap-4">
					<label class="label">
						<input class="radio" type="radio" name="booleanValue" value={true} bind:group={value} />
						True
					</label>
					<label class="label">
						<input
							class="radio"
							type="radio"
							name="booleanValue"
							value={false}
							bind:group={value}
						/>
						False
					</label>
				</div>
			</label>
		{/if}

		<!-- Submit button -->
		<button type="submit" class="sr-only">Submit</button>
		<!-- Hidden button for form submission -->
	</form>
</Modal>
