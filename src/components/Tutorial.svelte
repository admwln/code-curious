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

<div class="p-4 mb-[48px] md:mb-[58px] lg:mb-0 md:overflow-x-scroll">
	{#if data.prevLesson}
		<p class="mb-4">
			<a class="anchor" href={`/tutorial/${data.prevLesson}`}>&lt;&lt; Previous</a>
		</p>
	{/if}
	<div class="markdown">
		<h3 class="mb-2 text-3xl">{data.title}</h3>
		{#each data.content as content}
			{#if content.startsWith('{{')}
				<Parser placeholder={parsePlaceholder(content)} />
			{:else}
				{@html marked(content)}
			{/if}
		{/each}
	</div>
	{#if data.nextLesson}
		<p>
			<!-- The 'next lesson' link text content defaults to 'Next >>' -->
			{#if data.nextLesson === 'lesson-1'}
				<a class="anchor" href={`/tutorial/${data.nextLesson}`}>Start the tutorial &gt;&gt;</a>
			{:else}
				<a class="anchor" href={`/tutorial/${data.nextLesson}`}>Next &gt;&gt;</a>
			{/if}
		</p>
	{/if}
</div>
