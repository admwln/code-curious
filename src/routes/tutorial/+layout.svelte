<script lang="ts">
	import { currentPanel } from '$lib/store'; // Import the store
</script>

<slot></slot>

<!-- Mobile Buttons for Panel Toggle (shared) -->
<div class="bg-tertiary-800 fixed flex justify-center bottom-0 inset-x-0 md:hidden">
	<class class="flex justify-center m-2">
		<!-- The $ prefix is shorthand for subscribing to a store in Svelte. -->
		<button
			type="button"
			on:click={() => ($currentPanel = 1)}
			class="btn btn-sm {$currentPanel === 1
				? 'variant-filled-surface focus:variant-filled-surface'
				: ''}">Tutorial</button
		>

		<button
			type="button"
			on:click={() => ($currentPanel = 2)}
			class="btn btn-sm {$currentPanel === 2
				? 'variant-filled-surface focus:variant-filled-surface'
				: ''}">Editor & Console</button
		>
		<button
			type="button"
			on:click={() => ($currentPanel = 3)}
			class="btn btn-sm {$currentPanel === 3
				? 'variant-filled-surface focus:variant-filled-surface'
				: ''}">Funnel</button
		>
	</class>
</div>
<!-- Tablet (md) Toggle Buttons (for Panel 1 and Panel 2) -->
<div
	class="bg-tertiary-800 hidden md:w-1/2 md:flex md:justify-center lg:hidden fixed bottom-0 left-0"
>
	<div class="flex justify-center m-2">
		<!-- Toggle buttons for Panel 1 and Panel 2 only -->
		<button
			type="button"
			on:click={() => ($currentPanel = 1)}
			class="btn {$currentPanel === 1 ? 'variant-filled-surface focus:variant-filled-surface' : ''}"
			>Tutorial</button
		>

		<button
			type="button"
			on:click={() => ($currentPanel = 2)}
			class="btn {$currentPanel === 2 ? 'variant-filled-surface focus:variant-filled-surface' : ''}"
			>Editor & Console</button
		>
	</div>
</div>
