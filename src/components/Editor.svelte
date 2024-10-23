<script lang="ts">
	import Variable from './Variable.svelte';
	// Expose the data prop to receive the data from the parent +page.svelte
	export let data;
	console.log('Editor data', data);
</script>

<div class="flex flex-col min-h-[320px] justify-start">
	<div class="dummy-btns">
		<Variable />
	</div>
</div>
