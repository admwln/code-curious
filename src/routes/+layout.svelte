<script lang="ts">
	import '../app.postcss';
</script>

<div class="flex flex-col min-h-screen">
	<!-- Header (shared across all pages) -->
	<header class="bg-secondary-800 text-white p-4">
		<div class="container mx-auto flex justify-between items-center">
			<a href="/" class="hover:text-gray-200"><h1>Funnel</h1></a>
			<nav class="flex space-x-4">
				<a href="/tutorial/welcome" class="hover:text-gray-200">Tutorial</a>
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
</div>
