<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	// Props
	export let isOpen: boolean = false; // Modal visibility control
	const dispatch = createEventDispatcher();

	// Close modal on escape key press
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			dispatch('close');
			//isOpen = false;
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
			<header>
				<slot name="header"></slot>
			</header>
			<hr class="opacity-50" />
			<section><slot name="content"></slot></section>
			<hr class="opacity-50" />
			<footer>
				<slot name="footer"></slot>
			</footer>
		</div>
	</div>
{/if}
