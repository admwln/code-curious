<script lang="ts">
	import '../app.postcss';
	import { currentPanel } from '$lib/store'; // Import the store
</script>

<div class="flex flex-col min-h-screen">
	<!-- Header (shared across all pages) -->
	<header class="bg-secondary-800 text-white p-4">
		<div class="container mx-auto flex justify-between items-center">
			<a href="/" class="hover:text-gray-200"><h1>Funnel Logic</h1></a>
			<nav class="flex space-x-4">
				<a href="/" class="hover:text-gray-200">Home</a>
				<a href="/about" class="hover:text-gray-200">About</a>
				<a href="/login" class="hover:text-gray-200">Log in</a>
			</nav>
		</div>
	</header>

	<!-- Main Layout (shared) -->
	<main class="flex-1 flex flex-col md:flex-row h-full">
		<!-- This is where the content of each page will be injected -->
		<slot></slot>
	</main>

	<!-- Mobile Buttons for Panel Toggle (shared) -->
	<div class="bg-tertiary-800 fixed flex justify-center bottom-0 inset-x-0 md:hidden">
		<class class="flex gap-4 justify-center m-2">
			<!-- The $ prefix is shorthand for subscribing to a store in Svelte. -->
			<button
				type="button"
				on:click={() => ($currentPanel = 1)}
				class="px-4 py-2 rounded-full shadow-sm {$currentPanel === 1
					? 'variant-filled-surface focus:variant-filled-surface'
					: ''}">Tutorial</button
			>

			<button
				type="button"
				on:click={() => ($currentPanel = 2)}
				class="px-4 py-2 rounded-full shadow-sm {$currentPanel === 2
					? 'variant-filled-surface focus:variant-filled-surface'
					: ''}">Editor</button
			>
			<button
				type="button"
				on:click={() => ($currentPanel = 3)}
				class="px-4 py-2 rounded-full shadow-sm {$currentPanel === 3
					? 'variant-filled-surface focus:variant-filled-surface'
					: ''}">Funnel</button
			>
		</class>
	</div>
	<!-- Tablet (md) Toggle Buttons (for Panel 1 and Panel 2) -->
	<div
		class="bg-tertiary-800 hidden md:w-1/2 md:flex md:justify-center lg:hidden fixed bottom-0 left-0"
	>
		<div class="flex gap-4 justify-center m-2">
			<!-- Toggle buttons for Panel 1 and Panel 2 only -->
			<button
				type="button"
				on:click={() => ($currentPanel = 1)}
				class="px-4 py-2 rounded-full shadow-sm {$currentPanel === 1
					? 'variant-filled-surface focus:variant-filled-surface'
					: ''}">Tutorial</button
			>

			<button
				type="button"
				on:click={() => ($currentPanel = 2)}
				class="px-4 py-2 rounded-full shadow-sm {$currentPanel === 2
					? 'variant-filled-surface focus:variant-filled-surface'
					: ''}">Editor</button
			>
		</div>
	</div>
</div>
