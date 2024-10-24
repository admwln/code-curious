<script lang="ts">
	import VariableForm from './VariableForm.svelte';
	import type { VariableType } from '$lib/types';

	import { snapshot } from '$lib/store'; //Snapshot store

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
	let value: string | number | boolean | any[] | object = data.value; // Holds the value input

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
	<VariableForm
		formId="editVariable"
		{value}
		onSave={updateVariable}
		bind:dataType
		bind:variableName
		on:updateValue={(e) => (value = e.detail)}
		on:updateDataType={(e) => (dataType = e.detail)}
		on:updateVariableName={(e) => (variableName = e.detail)}
	/>
</Modal>
