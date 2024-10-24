<script lang="ts">
	import { snapshot } from '$lib/store'; // User code
	import Variable from './Variable.svelte';
	import NewVariable from './NewVariable.svelte';

	export let data; // Data passed from the parent component
	console.log('Editor data', data);
</script>

<div class="min-h-[320px] flex flex-col justify-start gap-2">
	<div class="flex flex-col items-start gap-2">
		<!-- loop through each object in shapshot, if any -->
		{#if $snapshot.length > 0}
			{#each $snapshot as variable (variable.id)}
				<Variable data={variable} />
			{/each}
		{/if}
	</div>
	<div>
		<NewVariable />
	</div>
</div>
