<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores'; // Correct import for page store

	// Example of locally stored lessons data
	const lessons: { [key: string]: LessonData } = {
		'lesson-1': {
			tutorial: {
				title: 'Lesson 1: Introduction to Variables',
				description: 'In this lesson, we will cover basic variable declarations.',
				topics: [
					{ name: 'What is a variable?' },
					{ name: 'Variable types' },
					{ name: 'Declaring variables' },
				],
				exampleCode: 'let x = 5;\nlet y = 10;\nconsole.log(x + y);',
			},
			editor: {
				defaultCode: "console.log('Hello, World!');",
			},
		},
		'lesson-2': {
			tutorial: {
				title: 'Lesson 2: Introduction to Functions',
				description: 'In this lesson, we will cover basic function declarations.',
				topics: [
					{ name: 'What is a function?' },
					{ name: 'Function syntax' },
					{ name: 'Calling functions' },
				],
				exampleCode: 'function add(x, y) {\n\treturn x + y;\n}\nconsole.log(add(5, 10));',
			},
			editor: {
				defaultCode: "console.log('Hello, World!');",
			},
		},
	};

	interface LessonData {
		tutorial: {
			title: string;
			description: string;
			topics: { name: string }[];
			exampleCode: string;
		};
		editor: {
			defaultCode: string;
		};
	}

	let lessonData: LessonData | null = null;
	let lessonId = '';

	// Subscribe to the `page` store to get the current route parameters
	const unsubscribe = page.subscribe(({ params }) => {
		lessonId = params.lessonId; // Assuming `lessonId` is a dynamic route param
		lessonData = lessons[lessonId] || null; // Fetch the lesson data or set to null if not found
	});

	// Unsubscribe when the component is destroyed to avoid memory leaks
	onDestroy(() => {
		unsubscribe();
	});
</script>

{#if lessonData}
	<h1>{lessonData.tutorial.title}</h1>
	<p>{lessonData.tutorial.description}</p>
	<ul>
		{#each lessonData.tutorial.topics as topic}
			<li>{topic.name}</li>
		{/each}
	</ul>
	<code>{lessonData.tutorial.exampleCode}</code>
{:else}
	<p>Loading...</p>
{/if}
