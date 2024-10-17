<script lang="ts">
	import { currentPanel } from '$lib/store'; // Import the store
	import { faChalkboardUser, faDesktop, faFilter } from '@fortawesome/free-solid-svg-icons';
	import { faFileCode } from '@fortawesome/free-regular-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import Matter from '../components/Matter.svelte';
</script>

<!-- Panel 1 -->
<div
	class="bg-neutral-900 w-full h-screen md:w-1/2 lg:w-1/3 lg:block {$currentPanel !== 1
		? 'hidden'
		: ''} overflow-y-scroll"
>
	<h2 class="p-4 bg-neutral-600"><FontAwesomeIcon icon={faChalkboardUser} /> Tutorial</h2>
	<p class="p-4">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
	<ul class="p-4 list">
		<li>Data types</li>
		<li>Variables</li>
		<li>Operators</li>
		<li>Functions</li>
		<li>Loops</li>
	</ul>
	<p class="p-4">
		Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam totam nobis nisi ducimus dolor
		aperiam. Quia ea deserunt incidunt cumque quis! Nisi sint, repellat vitae veritatis saepe
		perferendis inventore, quia neque necessitatibus alias enim omnis commodi expedita veniam
		obcaecati provident incidunt deserunt amet dolores maiores quasi natus eaque? Voluptate sit in
		eaque natus laudantium ad sint! Totam veritatis temporibus placeat ipsum, necessitatibus
		similique nihil rem tenetur expedita illum! Obcaecati iusto rerum consectetur quas libero soluta
		ut!
	</p>
	<p class="p-4">
		Exercitationem ipsam, amet quasi ad dignissimos tenetur esse eligendi unde delectus, expedita
		laborum nulla vel deleniti alias sapiente eius iste? Animi saepe laboriosam minus dolores illo,
		labore hic repellendus consequatur nihil. Sed repellat ab placeat tempore perspiciatis
		asperiores. Facilis, repellendus. Possimus aliquam cupiditate illo illum dolore magni aliquid
		molestias cumque! Eveniet, facilis. Illum error odio ipsam consequuntur eveniet eos repellat,
		architecto est aut animi, dolore fuga quaerat magnam quia laudantium fugiat ipsa quam, rerum
		aspernatur perspiciatis tempora?
	</p>
</div>

<!-- Panel 2 -->
<div
	class="bg-neutral-900 w-full h-screen md:w-1/2 lg:w-1/3 lg:block {$currentPanel !== 2
		? 'hidden'
		: ''} overflow-y-scroll"
>
	<h2 class="p-4 bg-neutral-700"><FontAwesomeIcon icon={faFileCode} /> Editor</h2>
	<p class="p-4">Here you will find all the code blocks!</p>
</div>

<!-- Panel 3 (always visible on tablet and desktop) -->
<div
	class="bg-neutral-900 w-full h-screen md:w-1/2 lg:w-1/3 lg:block {$currentPanel !== 3
		? 'hidden md:block lg:block'
		: ''} overflow-y-scroll"
>
	<h2 class="p-4 bg-neutral-800"><FontAwesomeIcon icon={faFilter} /> Funnel</h2>
	<Matter />
</div>
