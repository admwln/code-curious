import { error } from '@sveltejs/kit';
import lessons from '$lib/lessons.json';
import type { LessonData } from '$lib/types';

// Explicitly type the fetched lessons
const fetchedLessons: { [key: string]: LessonData } = lessons;

export const load = async ({ params }) => {
	const lessonId: string = params.lessonId; // Get the dynamic route param (e.g., 'lesson-1')

	const lessonData: LessonData = fetchedLessons[lessonId];

	if (!lessonData) {
		throw error(404, `Lesson ${lessonId} not found`);
	}

	// Just return the lessonData without the redundant lessonId field
	return {
		lessonData,
		lessonId, // Return the lessonId separately if needed
	};
};
