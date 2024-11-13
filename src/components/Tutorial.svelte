<script lang="ts">
	import { marked } from 'marked';
	import Parser from './Parser.svelte';
	import { fetchLessonTitle } from '$lib/utils/fetchLessonTitle';

	// Expose the data prop to receive the data from the parent +page.svelte
	export let data;
	let nextTitle = '';
	let previousTitle = '';

	// When data changes, update the next and previous lesson titles using the fetchLessonTitle function
	$: {
		(async () => {
			if (data.nextLesson) {
				const result = await fetchLessonTitle(data.nextLesson);
				nextTitle = result ? result.title : '';
			}
			if (data.prevLesson) {
				const result = await fetchLessonTitle(data.prevLesson);
				previousTitle = result ? result.title : '';
			}
		})();
	}

	// Helper function to split placeholder at , into an array
	const parsePlaceholder = (placeholder: string) => {
		let placeholderArray: string[] = placeholder.split('|').map((item) => item.trim());
		placeholderArray[0] = placeholderArray[0].replace('{{', '');
		return placeholderArray;
	};
</script>

<div class="p-4 mb-[48px] md:mb-[58px] lg:mb-0 md:overflow-x-scroll">
	<div class="mb-4">
		{#if data.prevLesson}
			<a class="anchor" href={`/tutorial/${data.prevLesson}`}>&lt;&lt; {previousTitle}</a>
		{/if}
		{#if data.prevLesson && data.nextLesson}
			<span class="mx-2 text-zinc-700">|</span>
		{/if}
		{#if data.nextLesson}
			<a class="anchor" href={`/tutorial/${data.nextLesson}`}>{nextTitle} &gt;&gt;</a>
		{/if}
	</div>
	<h3 class="mb-2 text-3xl">{data.title}</h3>
	<div>
		{#each data.content as content}
			{#if content.startsWith('{{')}
				<Parser placeholder={parsePlaceholder(content)} />
			{:else}
				<div class="markdown">
					{@html marked(content)}
				</div>
			{/if}
		{/each}
	</div>
	<div>
		{#if data.nextLesson === 'lesson-1'}
			<p>
				<a class="anchor" href={`/tutorial/${data.nextLesson}`}>Start the first lesson &gt;&gt;</a>
			</p>
		{:else}
			<p>
				<a class="anchor" href={`/tutorial/${data.nextLesson}`}>{nextTitle} &gt;&gt;</a>
			</p>
		{/if}
		<!-- {#if data.prevLesson}
			<p>
				<a class="anchor" href={`/tutorial/${data.prevLesson}`}>&lt;&lt; {previousTitle}</a>
			</p>
		{/if} -->
	</div>
</div>
