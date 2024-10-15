<script lang="ts">
	import Matter from '../components/Matter.svelte';

	import { faFilter } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { supabase } from '$lib/supabaseClient';

	// Define the shape of a country object based on your table schema
	type Country = {
		id: number;
		name: string;
	};

	let countries: Country[] = [];

	// use supabase client to fetch data from countries table
	const fetchCountries = async () => {
		const { data, error } = await supabase.from('countries').select('*');
		if (error) {
			console.error('Error fetching countries', error);
		}
		countries = data ?? [];
	};
	fetchCountries();
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">
			<FontAwesomeIcon icon={faFilter} /> Funnel
		</h1>
		<Matter />
	</div>

	<ol class="list">
		{#each countries as country}
			<li>
				<span class="badge-icon p-4 variant-soft-primary">{country.id}</span>
				<span class="flex-auto">{country.name}</span>
			</li>
		{/each}
	</ol>
</div>
