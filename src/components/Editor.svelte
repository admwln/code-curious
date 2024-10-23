<script lang="ts">
	// Expose the data prop to receive the data from the parent +page.svelte
	export let data;
	console.log('Editor data', data);
</script>

<div class="flex flex-col min-h-[320px] justify-start">
	<div class="dummy-btns">
		<button class="btn btn-sm bg-secondary-900">Var</button>
		<button class="btn btn-sm bg-secondary-900">Object</button>
		<button class="btn btn-sm bg-secondary-900">Array</button>
		<button class="btn btn-sm bg-secondary-900">If</button>
		<button class="btn btn-sm bg-secondary-900">Loop</button>
	</div>
</div>
