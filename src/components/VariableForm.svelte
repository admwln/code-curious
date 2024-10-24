<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let variableName: string;
	export let dataType: string;
	export let value: string | number | boolean | any[] | object;
	export let formId: string; // Form ID to trigger submit event
	export let onSave: () => void;

	const dispatch = createEventDispatcher();

	// Handle changes in the input fields and dispatch events to parent
	function handleVariableNameChange(event: Event) {
		variableName = (event.target as HTMLInputElement).value;
		dispatch('updateVariableName', variableName);
	}

	function handleDataTypeChange(event: Event) {
		dataType = (event.target as HTMLSelectElement).value;
		resetValue();
		dispatch('updateDataType', dataType);
	}

	function handleValueChange(event: Event) {
		value = (event.target as HTMLInputElement).value;
		dispatch('updateValue', value);
	}

	// Handle change in the data type
	function resetValue() {
		if (dataType === 'text') {
			value = '';
		} else if (dataType === 'number') {
			value = 0;
		} else if (dataType === 'bool') {
			value = false;
		} else if (dataType === 'array') {
			value = [];
		} else if (dataType === 'object') {
			value = {}; // Start with an empty object
		}
	}
</script>

<!-- Form Layout -->
<form id={formId} on:submit|preventDefault={onSave} class="px-4 flex flex-col gap-4 items-start">
	<!-- Variable Name Input -->
	<label class="label">
		<span>Name</span>
		<input
			class="input"
			type="text"
			bind:value={variableName}
			on:input={handleVariableNameChange}
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
			<option value="array">Array</option>
			<option value="object">Object</option>
		</select>
	</label>

	<!-- Conditional Value Input -->
	{#if dataType === 'text'}
		<label class="label">
			<span>Value</span>
			<input
				class="input"
				type="text"
				bind:value
				on:input={handleValueChange}
				name="text"
				required
			/>
		</label>
	{:else if dataType === 'number'}
		<label class="label">
			<span>Value</span>
			<input
				class="input"
				type="number"
				bind:value
				on:input={handleValueChange}
				name="number"
				required
			/>
		</label>
	{:else if dataType === 'bool'}
		<label class="label">
			<span>Value</span>
			<div class="flex gap-4">
				<label class="label">
					<input class="radio" type="radio" name="booleanValue" value={true} bind:group={value} /> True
				</label>
				<label class="label">
					<input class="radio" type="radio" name="booleanValue" value={false} bind:group={value} /> False
				</label>
			</div>
		</label>
	{:else if dataType === 'array'}
		<!-- Array Input -->
		<label class="label">
			<span>Array of values</span>
			<!-- You can add additional logic here for managing array inputs -->
			<input
				class="input"
				type="text"
				placeholder="Enter comma-separated values"
				bind:value
				on:input={handleValueChange}
			/>
		</label>
	{:else if dataType === 'object'}
		<!-- Object Input -->
		<label class="label">
			<span>Object</span>
			<!-- You can add additional logic here for key-value pairs -->
			<textarea
				class="input"
				bind:value
				on:input={handleValueChange}
				placeholder="Enter JSON-like structure"
			></textarea>
		</label>
	{/if}

	<!-- Hidden Submit Button -->
	<button type="submit" class="sr-only">Submit</button>
</form>
