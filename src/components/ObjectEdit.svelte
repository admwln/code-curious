<script lang="ts">
	import { snapshot } from '$lib/store';
	import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { ObjectVariable } from '$lib/types';

	export let objectVariable: ObjectVariable | null;
	let keyValueCount = 1;
	let _object: Record<string, any> = {}; // Intermediate object to store key-value pairs

	if (!objectVariable) {
		objectVariable = {
			id: Date.now(),
			name: '',
			type: 'object',
			value: { sampleKey: 'sample value' },
		};
		_object = { ...objectVariable.value };
	} else {
		_object = { ...objectVariable.value };
		//Count the number of key-value pairs
		keyValueCount = Object.keys(_object).length;
	}

	let objectKeys: string[] = Object.keys(_object);
	let objectTypes: string[] = ['string'];
	let objectValues: any[] = Object.values(_object);
	console.log(objectKeys, objectTypes, objectValues);

	// Helper to determine the type of each value
	const getType = (value: any): string => {
		const type = typeof value;
		return type === 'string' || type === 'number' || type === 'boolean' ? type : 'string';
	};

	// Function to add an empty key-value pair
	const addKeyValuePair = () => {
		_object[`key${Object.keys(_object).length + 1}`] = '';
		keyValueCount++;
		_object = { ..._object }; // Trigger reactivity
	};

	// Function to remove a key-value pair
	const removeKeyValuePair = () => {
		const keys = Object.keys(_object);
		if (keys.length > 0) {
			const lastKey = keys[keys.length - 1];
			delete _object[lastKey];
			keyValueCount--;
			_object = { ..._object }; // Trigger reactivity
		}
	};

	// Function to update key
	const updateKey = (e: Event, oldKey: string) => {
		const target = e.target as HTMLInputElement;
		const newKey = target.value;
		if (newKey !== oldKey) {
			_object[newKey] = _object[oldKey];
			delete _object[oldKey];
			_object = { ..._object }; // Trigger reactivity
		}
		console.log('Updated object value', _object);
	};

	// Function to handle type changes
	const handleTypeChange = (e: Event, index: number) => {
		const target = e.target as HTMLSelectElement;
		const newType = target.value;
		objectTypes[index] = newType;
		return newType;
	};

	// Function to handle value changes
	const updateValue = (e: Event, index: number, key: string) => {
		const target = e.target as HTMLInputElement;
		const newValue = target.value;
		objectValues[index] = newValue;
		_object[key] = newValue;
		_object = { ..._object }; // Trigger reactivity
		console.log('Updated object value', _object);
		return newValue;
	};
</script>

<div class="flex flex-col gap-3 items-start">
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
								class="input px-2 py-0 text-sm"
								type="text"
								name="key"
								bind:value={objectKeys[i]}
								on:blur={(e) => {
									updateKey(e, key);
								}}
								autocomplete="off"
								required
							/>
						</label>
					</td>

					<!-- Type Selector -->
					<td class="p-0.5">
						<select
							class="select px-2 py-0 mt-1 text-sm"
							value={getType(value)}
							on:change={(e) => {
								const newType = handleTypeChange(e, i);
								if (newType === 'string') _object[key] = String(value);
								if (newType === 'number') _object[key] = Number(value);
								if (newType === 'boolean') _object[key] = Boolean(value);
							}}
						>
							<option value="string">String</option>
							<option value="number">Number</option>
							<option value="boolean">Boolean</option>
						</select>
					</td>

					<!-- Value Input -->
					<td class="p-0.5">
						<!-- Check selected data type -->
						{#if objectTypes[i] === 'string'}
							<label class="label">
								<span class="sr-only">Value</span>
								<input
									class="input px-2 py-0 text-sm"
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
							<span>Number!</span>
						{/if}
						{#if objectTypes[i] === 'boolean'}
							<span>Boolean!</span>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="flex gap-1">
		<button
			type="button"
			on:click={addKeyValuePair}
			class="btn btn-sm variant-ghost-secondary flex gap-2"
			><FontAwesomeIcon icon={faPlus} /> <span class="sr-only">Add key/value pair</span></button
		>
		<button
			type="button"
			on:click={removeKeyValuePair}
			class="btn btn-sm variant-ghost-primary flex gap-2"
			><FontAwesomeIcon icon={faMinus} /> <span class="sr-only">Remove key/value pair</span></button
		>
	</div>
</div>
