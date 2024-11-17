<script lang="ts">
	import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	// Local `isOpen` state for each instance
	export let open: boolean;
	export let topBorder: boolean;
	export let rounded: boolean;
	export let color: string;
	let isOpen: boolean = open ?? false;

	// Generate a unique ID for accessibility attributes
	const uniqueId = `accordion-${Math.random().toString(36)}`;

	// Toggle open/close state
	function toggleAccordion() {
		isOpen = !isOpen;
	}
</script>

<button
	type="button"
	class="w-full flex items-center justify-between space-x-4 py-3 px-4 {color} {topBorder
		? 'border-t border-zinc-700'
		: ''} {rounded ? 'rounded-t-xl' : ''} {rounded && !isOpen ? 'rounded-b-xl' : ''}"
	on:click={toggleAccordion}
	aria-expanded={isOpen}
	aria-controls={`${uniqueId}-content`}
	aria-label={isOpen ? 'Collapse details' : 'Expand details'}
>
	<slot name="summary" id={`${uniqueId}-summary`}></slot>
	<slot name="summary-button"></slot>
	{#if isOpen}
		<FontAwesomeIcon icon={faAngleUp} />
	{:else}
		<FontAwesomeIcon icon={faAngleDown} />
	{/if}
</button>

<!-- Conditionally apply hidden class and add role for screen readers -->
<div
	class:!hidden={!isOpen}
	id={`${uniqueId}-content`}
	role="region"
	aria-labelledby={`${uniqueId}-summary`}
>
	<div>
		<slot name="content"></slot>
	</div>
</div>
