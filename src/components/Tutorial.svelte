<script lang="ts">
	import { marked } from 'marked';
	import Parser from './Parser.svelte';

	// Expose the data prop to receive the data from the parent +page.svelte
	export let data;

	// Helper function to split placeholder at , into an array
	const parsePlaceholder = (placeholder: string) => {
		let placeholderArray: string[] = placeholder.split(',').map((item) => item.trim());
		placeholderArray[0] = placeholderArray[0].replace('{{', '');
		return placeholderArray;
	};
</script>

<div class="p-4 md:overflow-x-scroll">
	<div class="markdown">
		<h2>{data.title}</h2>
		{#each data.content as content}
			{#if content.startsWith('{{')}
				<Parser placeholder={parsePlaceholder(content)} />
			{:else}
				{@html marked(content)}
			{/if}
		{/each}
		<p>
			<a class="anchor" href={`/tutorial/${data.nextLesson}`}>Next lesson &gt;&gt;</a>
		</p>
	</div>
</div>
