<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	import { faFloppyDisk, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	// Props
	export let header: string;
	export let isOpen: boolean = false; // Modal visibility control
	export let formId: string; // Form ID to trigger submit event
	export let deleteFunction: (() => void) | undefined; // Delete function
	// export let onSave: () => void;

	const dispatch = createEventDispatcher();

	// Emit event to parent to close the modal
	function closeModal() {
		dispatch('close');
	}

	// Close modal on escape key press
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	onMount(() => {
		// Add event listener to handle "Escape" key close
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if isOpen}
	<!-- Background overlay -->
	<div
		class="fixed inset-0 bg-neutral-900 bg-opacity-75 z-50 flex items-start justify-center pt-0 md:pt-8"
	>
		<!-- Modal container -->
		<div
			class="m-2 card w-full text-token space-y-4 rounded-lg shadow-lg overflow-hidden max-w-md z-50 relative"
		>
			<header class="card-header flex justify-between">
				<h3 class="text-lg font-semibold">{header}</h3>
				<button on:click={closeModal}><FontAwesomeIcon icon={faXmark} /></button>
			</header>
			<hr class="opacity-50" />
			<section><slot></slot></section>
			<hr class="opacity-50" />
			<footer class="card-footer flex justify-between">
				{#if deleteFunction}
					<button
						type="button"
						on:click={deleteFunction}
						class="btn btn-sm bg-primary-700 flex gap-2"
					>
						<FontAwesomeIcon icon={faTrash} /> Delete
					</button>
				{:else}
					<div></div>
				{/if}
				<div class="flex">
					<button on:click={closeModal} class="btn"> Cancel </button>
					<button
						on:click={() => {
							// Trigger the form submit by dispatching an event
							const form = document.getElementById(formId);
							if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
						}}
						class="btn btn-sm bg-secondary-700 flex gap-2"
					>
						<FontAwesomeIcon icon={faFloppyDisk} /> Save
					</button>
				</div>
			</footer>
		</div>
	</div>
{/if}
