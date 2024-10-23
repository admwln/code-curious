<script lang="ts">
	// Expose the data prop to receive the data from the parent +page.svelte
	export let data;
</script>

{#each data.defaultCode as code}
	<p>
		<code>{code}</code>
	</p>
{/each}
