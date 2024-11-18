<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { ObjectVariable } from '$lib/types';

	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	export let objectVariable: ObjectVariable | null;
	const dispatch = createEventDispatcher();
	let _object: Record<string, any> = {}; // Temporary object to store key-value pairs
	let _pairCount: number = 1; // How many key-value pairs there are in the temporary object

	let objectTypes: string[] = [];
	let objectValues: any[] = [];
	// Helper to determine the type of each value
	const getType = (value: any): string => {
		const type = typeof value;
		return type === 'string' || type === 'number' || type === 'boolean' ? type : 'string';
	};
	const getObjectTypes = () => {
		//Loop through _object and get the type of each value using getType helper
		const types = Object.values(_object).map((value) => getType(value));
		return types;
	};

	if (!objectVariable) {
		objectVariable = {
			id: Date.now(),
			blockType: 'variable',
			name: '',
			type: 'object',
			value: { key1: '' },
		};
		objectTypes = ['string'];
		_object = { ...objectVariable.value };
		_pairCount = 1;
	} else {
		_object = { ...objectVariable.value };
		objectTypes = getObjectTypes();
		objectValues = Object.values(_object);
		// For each item in objectTypes, check if it's a boolean and convert the corresponding value to
		// a string, to accomodate the RadioGroup component
		objectTypes.forEach((type, index) => {
			if (type === 'boolean') {
				objectValues[index] = String(objectValues[index]);
			}
		});
		// Update pair count
		_pairCount = Object.keys(_object).length;
	}

	let objectKeys: string[] = Object.keys(_object);

	// Function to add an empty key-value pair
	const addKeyValuePair = () => {
		// First check if _pairCount is already at the maximum (5)
		if (_pairCount >= 5) return;
		const newKeyName = `key${Object.keys(_object).length + 1}`;
		_object[newKeyName] = '';
		// Push the new key to the arrays
		objectKeys.push(newKeyName);
		objectTypes.push('string');
		objectValues.push('');
		respawnObject();
		_object = { ..._object }; // Trigger reactivity
		_pairCount++;
	};

	// Function to remove a key-value pair
	const removeKeyValuePair = () => {
		const keys = Object.keys(_object);
		if (keys.length > 1) {
			const lastKey = keys[keys.length - 1];
			delete _object[lastKey];
			// Remove the last key from the arrays
			objectKeys.pop();
			objectTypes.pop();
			objectValues.pop();
			respawnObject();
			_object = { ..._object }; // Trigger reactivity
			_pairCount--;
		}
	};

	// Function to respawn object from scratch, using the arrays
	const respawnObject = () => {
		const newObject: Record<string, any> = {};

		// Loop through objectTypes; if type is 'boolean', convert values to true boolean
		objectKeys.forEach((key, index) => {
			if (objectTypes[index] === 'boolean') {
				newObject[key] = objectValues[index] === 'true'; // Convert string 'true'/'false' to boolean
			} else {
				newObject[key] = objectValues[index];
			}
		});

		// Update objectVariable.value with the new object structure
		objectVariable.value = newObject;

		// Dispatch the updated objectVariable to parent
		dispatch('update', objectVariable);

		return newObject;
	};

	// Function to update key
	const updateKey = (e: Event, oldKey: string, index: number) => {
		const target = e.target as HTMLInputElement;
		const newKey = target.value;
		if (newKey !== oldKey) {
			objectKeys[index] = newKey;
			_object = respawnObject();
		}
		_object = { ..._object }; // Trigger reactivity
	};

	// Function to handle type changes
	const handleTypeChange = (e: Event, index: number) => {
		const target = e.target as HTMLSelectElement;
		const newType = target.value;
		objectTypes[index] = newType;

		//Change initial value of corresponding value
		if (newType === 'number') objectValues[index] = 0;
		if (newType === 'boolean') objectValues[index] = 'false';
		if (newType === 'string') objectValues[index] = '';
		_object = respawnObject();
		_object = { ..._object }; // Trigger reactivity
		return newType;
	};

	// Function to handle value changes
	const updateValue = (e: Event, index: number, key: string) => {
		const target = e.target as HTMLInputElement;
		let newValue: string | number | boolean = target.value;
		if (objectTypes[index] === 'number') {
			newValue = Number(newValue);
		} //otherwise, it's a string
		objectValues[index] = newValue;

		_object = respawnObject();
		_object = { ..._object }; // Trigger reactivity
		return newValue;
	};
</script>

<div class="px-2 lg:p-2 flex flex-col gap-3 items-start">
	<div class="w-full flex justify-between lg:flex-col lg:gap-2">
		<!-- Count and display how many key-value pairs there curretly are -->

		<span>Key-Value Pairs: {_pairCount}</span>
		<div class="flex gap-1 items-center">
			<button
				type="button"
				on:click={addKeyValuePair}
				class="btn btn-sm variant-outline-secondary flex gap-1"
				><FontAwesomeIcon icon={faPlus} /><span class="sr-only">Add Key-Value Pair</span></button
			>
			<button
				type="button"
				on:click={removeKeyValuePair}
				class="btn btn-sm variant-outline-primary flex gap-1"
				><FontAwesomeIcon icon={faMinus} /><span class="sr-only">Remove Key-Value Pair</span
				></button
			>
		</div>
	</div>

	<table class="w-full text-sm text-left p-0 m-0">
		<thead class="text-x uppercase">
			<tr>
				<th scope="col" class="p-0.5">Key</th>
				<th scope="col" class="p-0.5">Type</th>
				<th scope="col" class="p-0.5">Value</th>
			</tr>
		</thead>
		<tbody>
			{#each Object.entries(_object) as [key, value], i}
				<tr>
					<!-- Key Input -->
					<td class="p-0.5">
						<label class="label">
							<span class="sr-only">Key</span>
							<input
								class="input px-2 py-1 text-sm"
								type="text"
								name="key"
								bind:value={objectKeys[i]}
								on:blur={(e) => {
									updateKey(e, key, i);
								}}
								autocomplete="off"
								required
								maxlength="25"
							/>
						</label>
					</td>

					<!-- Type Selector -->
					<td class="w-20 lg:w-24 p-0.5">
						<select
							name="type"
							class="select px-2 py-1 mt-1 text-sm"
							value={objectTypes[i]}
							on:change={(e) => {
								const newType = handleTypeChange(e, i);
								if (newType === 'string') _object[key] = String(value);
								if (newType === 'number') _object[key] = Number(value);
								if (newType === 'boolean') _object[key] = String(value);
							}}
						>
							<option value="string">String</option>
							<option value="number">Num</option>
							<option value="boolean">Bool</option>
						</select>
					</td>

					<!-- Value Input -->
					<td class="p-0.5">
						<!-- Check selected data type -->
						{#if objectTypes[i] === 'string'}
							<label class="label">
								<span class="sr-only">Value</span>
								<input
									name="value"
									class="input px-2 py-1 text-sm"
									type="text"
									bind:value={objectValues[i]}
									on:blur={(e) => {
										updateValue(e, i, key);
									}}
									autocomplete="off"
									required
								/>
							</label>
						{/if}
						{#if objectTypes[i] === 'number'}
							<label class="label">
								<span class="sr-only">Value</span>
								<input
									name="value"
									class="input px-2 py-1 text-sm"
									type="number"
									bind:value={objectValues[i]}
									on:blur={(e) => {
										updateValue(e, i, key);
									}}
									autocomplete="off"
									required
								/>
							</label>
						{/if}
						{#if objectTypes[i] === 'boolean'}
							<div class="p-2 flex gap-2">
								<label class="flex items-center space-x-2">
									<input
										class="radio"
										type="radio"
										name="radio-direct-{i}"
										bind:group={objectValues[i]}
										value="true"
										on:change={(e) => updateValue(e, i, key)}
									/>
									<p>True</p>
								</label>
								<label class="flex items-center space-x-2">
									<input
										class="radio"
										type="radio"
										name="radio-direct-{i}"
										bind:group={objectValues[i]}
										value="false"
										on:change={(e) => updateValue(e, i, key)}
									/>
									<p>False</p>
								</label>
							</div>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
