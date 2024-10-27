<script lang="ts">
	import VariableForm from './VariableForm.svelte';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	import { snapshot } from '$lib/store'; // Snapshot store

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
	let value: string | number | any[] | object = ''; // Holds the value input

	// Update handlers for changes coming from the child component
	function updateVariableName(event: CustomEvent<string>) {
		variableName = event.detail;
	}

	function updateDataType(event: CustomEvent<string>) {
		dataType = event.detail;
	}

	function updateValue(event: CustomEvent<string | number | any[] | object>) {
		value = event.detail;
	}

	// Each time the 'New Variable' modal is opened, reset the variable
	const resetVariable = () => {
		variableName = '';
		dataType = 'text';
		value = '';
	};

	// Function to handle form submission
	function createVariable() {
		const variable = {
			id: Date.now(),
			name: variableName,
			type: dataType,
			value: value,
		};
		// Add variable to snapshot store
		$snapshot = [...$snapshot, variable];
		closeModal();
	}
</script>

<!-- Button to open the modal -->
<button on:click={openModal} class="btn btn-sm bg-primary-900 flex gap-2"
	><FontAwesomeIcon icon={faPlus} /> Variable</button
>
<!-- Modal Component -->
<Modal header="New Variable" isOpen={showModal} on:close={closeModal} deleteFunction={undefined}>
	<!-- Listen to custom events from VariableForm -->
	<VariableForm
		{variableName}
		{dataType}
		{value}
		on:updateVariableName={updateVariableName}
		on:updateDataType={updateDataType}
		on:updateValue={updateValue}
		onSave={createVariable}
	/>
</Modal>
