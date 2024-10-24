<script lang="ts">
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	// Import the snapshot store
	import { snapshot } from '$lib/store';
	import type { VariableType } from '$lib/types';

	import Modal from './Modal.svelte';

	let showModal = false;
	function openModal() {
		resetVariable();
		showModal = true;
	}
	function closeModal() {
		showModal = false;
	}

	let variableName: string = ''; // Holds the variable's name
	let dataType: string = 'text'; // Default data type is 'Text' (1)
	let value: string | number | boolean = ''; // Holds the value input

	const resetVariable = () => {
		variableName = '';
		dataType = 'text';
		value = '';
	};

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

	let counter: number = 0;

	// Function to handle form submission
	function createVariable() {
		const variable = {
			id: `${Date.now()}-${counter}`,
			name: variableName,
			type: dataType,
			value: value,
		};
		// Do something with the variable (e.g., send to a server, store in state)
		// Add variable to snapshot store
		$snapshot = [...$snapshot, variable];
		console.log('Variable created:', variable);
		counter++;
		closeModal();
	}
</script>

<!-- Button to open the modal -->
<button on:click={openModal} class="btn btn-sm bg-primary-900 flex gap-2"
	><FontAwesomeIcon icon={faPlus} /> Variable</button
>
<!-- Modal Component -->
<Modal header="New Variable" isOpen={showModal} on:close={closeModal}>
	<form on:submit|preventDefault={createVariable}>
		<!-- Add form element here -->
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
			<label class="label">
				<span>Value: {value}</span>
				<input type="range" max="10" bind:value name="number" />
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
