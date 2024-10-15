<script lang="ts">
	import Matter from '../components/Matter.svelte';

	import { faFilter } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">
			<FontAwesomeIcon icon={faFilter} /> Funnel
		</h1>
		<Matter />
	</div>
</div>
