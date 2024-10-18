import { error } from '@sveltejs/kit';
import lessons from '$lib/lessons.json';
import type { LessonData } from '$lib/types';

// Explicitly type the fetched lessons
const fetchedLessons: { [key: string]: LessonData } = lessons;

export const load = async ({ params }) => {
	const lessonId: string = params.lessonId; // Get the dynamic route param (e.g., 'lesson-1')

	// Fetch the lesson data and type it as LessonData
	const lessonData: LessonData = fetchedLessons[lessonId];

	if (!lessonData) {
		// Throw a 404 error if the lesson is not found
		throw error(404, `Lesson ${lessonId} not found`);
	}

	// Return the lesson data to be passed to the page.svelte file
	return {
		lessonData,
	};
};
