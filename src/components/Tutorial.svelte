<script lang="ts">
	import { marked } from 'marked';

	// Expose the data prop to receive the data from the parent +page.svelte
	export let data;
</script>

<div class="p-4 md:overflow-x-scroll">
	<div class="markdown">
		<h2>{data.title}</h2>
		<!-- Render parsed markdown content -->
		{@html marked(data.content)}
		<p>
			<a class="anchor" href={`/tutorial/${data.nextLesson}`}>Next lesson</a>
		</p>
	</div>
</div>
