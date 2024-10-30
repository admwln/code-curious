<script lang="ts">
	import type { ConsoleData } from '$lib/types';
	// Expose the data prop to receive the data from the parent +page.svelte
	export let data: ConsoleData | null;
	console.log('Data passed to Console component', data);
</script>

<div class="rounded-md bg-slate-800 p-4">
	<!-- {#if data}
		{#each data.defaultCode as code}
			<p>
				<code>{code}</code>
			</p>
		{/each}
	{/if} -->
</div>
