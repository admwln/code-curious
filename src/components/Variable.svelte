<script lang="ts">
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	import Modal from '../components/Modal.svelte';
	let showModal = false;
	function openModal() {
		showModal = true;
	}
	function closeModal() {
		showModal = false;
	}

	let variableName: string = ''; // Holds the variable's name
	let dataType: string = 'text'; // Default data type is 'Text' (1)
	let value: string | number | boolean = ''; // Holds the value input

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

	const variables: { id: number; name: string; type: string; value: string | number | boolean }[] =
		[];
	let counter: number = 0;

	// Function to handle form submission
	function createVariable() {
		const variable = {
			id: counter++,
			name: variableName,
			type: dataType,
			value: value,
		};
		// Do something with the variable (e.g., send to a server, store in state)
		variables.push(variable);
		console.log('Variable pushed to variables:', variables);
	}
</script>

<!-- Button to open the modal -->
<button on:click={openModal} class="btn btn-sm bg-secondary-900 flex gap-2"
	><FontAwesomeIcon icon={faPlus} /> Variable</button
>
<!-- Modal Component -->
<Modal header="New Variable" isOpen={showModal} on:close={closeModal} onSave={createVariable}>
	<!-- Variable Name Input -->
	<label class="label">
		<span>Name</span>
		<input class="input" type="text" placeholder="Name" bind:value={variableName} />
	</label>

	<!-- Data Type Selector -->
	<label class="label">
		<span>Data type</span>
		<select class="select" bind:value={dataType} on:change={handleDataTypeChange}>
			<option value="text">Text</option>
			<option value="number">Number</option>
			<option value="bool">Boolean</option>
		</select>
	</label>

	<!-- Conditional Value Input -->
	<label class="label">
		{#if dataType === 'text'}
			<!-- Text input for 'Text' type -->
			<span>Value</span>
			<input class="input" type="text" placeholder="Value" bind:value />
		{:else if dataType === 'number'}
			<!-- Number input for 'Number' type -->
			<span>Value: {value}</span>
			<input type="range" max="10" bind:value />
		{:else if dataType === 'bool'}
			<!-- Radio buttons for 'Boolean' type -->

			<span>Value</span>
			<div class="flex gap-4">
				<label class="label">
					<input class="radio" type="radio" name="booleanValue" value={true} bind:group={value} />
					True
				</label>
				<label class="label">
					<input class="radio" type="radio" name="booleanValue" value={false} bind:group={value} />
					False
				</label>
			</div>
		{/if}
	</label>
</Modal>
