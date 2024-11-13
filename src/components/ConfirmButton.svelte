<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Props
	export let initiateText: string;
	export let confirmText: string = 'Confirm';
	export let cancelText: string = 'Cancel';
	export let onConfirm: () => void;
	export let initiateClass: string = 'btn btn-sm';
	export let confirmClass: string = 'btn btn-sm variant-outline-warning';
	export let cancelClass: string = 'btn btn-sm';

	// State
	let showConfirmButtons = false;

	// Dispatcher
	const dispatch = createEventDispatcher();

	// Methods
	const initiate = () => {
		showConfirmButtons = true;
	};

	const confirm = () => {
		showConfirmButtons = false;
		if (onConfirm) {
			onConfirm();
		}
		dispatch('confirmed');
	};

	const cancel = () => {
		showConfirmButtons = false;
	};
</script>

<!-- Render the initiate button or confirm/cancel buttons based on state -->
{#if showConfirmButtons}
	<div class="flex">
		<button type="button" class={cancelClass} on:click={cancel}>{cancelText}</button>
		<button type="button" class={confirmClass} on:click={confirm}>{confirmText}</button>
	</div>
{:else}
	<button type="button" class={initiateClass} on:click={initiate}>{initiateText}</button>
{/if}
