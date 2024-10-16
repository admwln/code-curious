<script lang="ts">
	import { currentPanel } from '$lib/store'; // Import the store
	import { faFilter } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
</script>

<!-- Panel 1 -->
<div class="bg-neutral-900 w-full md:w-1/2 lg:w-1/3 lg:block {$currentPanel !== 1 ? 'hidden' : ''}">
	<h2 class="p-4">Lesson 1: The Basics</h2>
	<p class="p-4">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
	<ul class="p-4 list">
		<li>Data types</li>
		<li>Variables</li>
		<li>Operators</li>
		<li>Functions</li>
		<li>Loops</li>
	</ul>
</div>

<!-- Panel 2 -->
<div class="bg-neutral-900 w-full md:w-1/2 lg:w-1/3 lg:block {$currentPanel !== 2 ? 'hidden' : ''}">
	<div class="p-4 bg-neutral-800"><FontAwesomeIcon icon={faFilter} /> Editor</div>
	<p class="p-4">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
</div>

<!-- Panel 3 (always visible on tablet and desktop) -->
<div
	class="bg-neutral-900 w-full md:w-1/2 lg:w-1/3 lg:block {$currentPanel !== 3
		? 'hidden md:block lg:block'
		: ''}"
>
	<div class="p-4 bg-neutral-900">Panel 3 Content for this page</div>
	<p class="p-4">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
</div>
