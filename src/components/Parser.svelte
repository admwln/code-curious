<script lang="ts">
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	// Expose the data prop to receive the data from the parent +page.svelte
	export let placeholder: string[];
</script>

{#if placeholder[0] === 'StringModal'}
	<div class="flex flex-col items-start my-4">
		<div class="card p-4 flex flex-col items-start gap-2">
			<label class="label">
				<span>Name</span>
				<input
					class="input"
					type="text"
					value={placeholder[1]}
					name="name"
					autocomplete="off"
					disabled
				/>
			</label>
			<label class="label">
				<span>Value</span>
				<input
					class="input"
					type="text"
					value={placeholder[2]}
					name="value"
					autocomplete="off"
					disabled
				/>
			</label>
		</div>
	</div>
{:else if placeholder[0] === 'VariableButton'}
	<button class="btn btn-sm bg-primary-900 flex gap-2"
		><FontAwesomeIcon icon={faPlus} /> Variable</button
	>
{/if}
