<script lang="ts">
	import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	// Local `isOpen` state for each instance
	export let open;
	let isOpen: boolean = open ?? false;

	// Generate a unique ID for accessibility attributes
	const uniqueId = `accordion-${Math.random().toString(36).substr(2, 9)}`;

	// Toggle open/close state
	function toggleAccordion() {
		isOpen = !isOpen;
	}
</script>

<div class="w-full flex items-center justify-between space-x-4 py-3 px-4 bg-[#ec489a2A]">
	<slot name="summary" id={`${uniqueId}-summary`}></slot>
	<button
		type="button"
		class="btn btn-sm py-1"
		on:click={toggleAccordion}
		aria-expanded={isOpen}
		aria-controls={`${uniqueId}-content`}
		aria-label={isOpen ? 'Collapse details' : 'Expand details'}
	>
		{#if isOpen}
			<FontAwesomeIcon icon={faAngleUp} />
		{:else}
			<FontAwesomeIcon icon={faAngleDown} />
		{/if}
	</button>
</div>

<!-- Conditionally apply hidden class and add role for screen readers -->
<div
	class:!hidden={!isOpen}
	id={`${uniqueId}-content`}
	role="region"
	aria-labelledby={`${uniqueId}-summary`}
>
	<slot name="content"></slot>
</div>
