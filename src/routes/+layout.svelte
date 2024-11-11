<script lang="ts">
	import '../app.postcss';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faUser } from '@fortawesome/free-solid-svg-icons';
	import { user } from '$lib/auth';

	// Reactive variable bound to the `user` store
	let loggedIn = false;

	// Update `loggedIn` based on `user` store's state
	$: loggedIn = Boolean($user); // Reactively update when `user` changes
</script>

<div class="flex flex-col min-h-screen">
	<!-- Header (shared across all pages) -->
	<header class="bg-secondary-800 text-white p-4">
		<div class="container mx-auto flex justify-between items-center">
			<a href="/" class="hover:text-gray-200"><h1>Funnel</h1></a>
			<nav class="flex gap-6">
				<a href="/tutorial/welcome" class="hover:text-gray-200">Tutorial</a>
				{#if !loggedIn}
					<a href="/login" class="hover:text-gray-200 flex gap-2 items-center"
						><FontAwesomeIcon icon={faUser} />Log in</a
					>
				{:else}
					<a href="/dashboard" class="hover:text-gray-200 flex gap-2 items-center"
						><FontAwesomeIcon icon={faUser} />Dashboard</a
					>
				{/if}
			</nav>
		</div>
	</header>

	<!-- Main Layout (shared) -->
	<main class="flex-1 flex flex-col md:flex-row h-full">
		<!-- This is where the content of each page will be injected -->
		<slot></slot>
	</main>
</div>
