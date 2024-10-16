<script lang="ts">
	import '../app.postcss';
	import { currentPanel } from '$lib/store'; // Import the store
</script>

<div class="flex flex-col min-h-screen">
	<!-- Header (shared across all pages) -->
	<header class="bg-blue-600 text-white p-4">
		<div class="container mx-auto flex justify-between items-center">
			<h1>Funnel Logic</h1>
			<nav class="flex space-x-4">
				<a href="/" class="hover:text-gray-200">Home</a>
				<a href="/about" class="hover:text-gray-200">About</a>
				<a href="/contact" class="hover:text-gray-200">Contact</a>
			</nav>
		</div>
	</header>

	<!-- Main Layout (shared) -->
	<main class="flex-1 flex flex-col md:flex-row">
		<!-- This is where the content of each page will be injected -->
		<slot></slot>
	</main>

	<!-- Mobile Buttons for Panel Toggle (shared) -->
	<div class="fixed bottom-0 inset-x-0 flex justify-evenly bg-blue-600 text-white md:hidden">
		<!-- The $ prefix is shorthand for subscribing to a store in Svelte. -->
		<button on:click={() => ($currentPanel = 1)}>Panel 1</button>
		<button on:click={() => ($currentPanel = 2)}>Panel 2</button>
		<button on:click={() => ($currentPanel = 3)}>Panel 3</button>
	</div>

	<!-- Tablet (md) Toggle Buttons (for Panel 1 and Panel 2) -->
	<div
		class="hidden md:flex lg:hidden fixed bottom-0 left-0 w-1/2 justify-evenly bg-blue-600 text-white"
	>
		<!-- Toggle buttons for Panel 1 and Panel 2 only -->
		<button on:click={() => ($currentPanel = 1)} class="w-1/2 text-center p-2">Panel 1</button>
		<button on:click={() => ($currentPanel = 2)} class="w-1/2 text-center p-2">Panel 2</button>
	</div>
</div>
