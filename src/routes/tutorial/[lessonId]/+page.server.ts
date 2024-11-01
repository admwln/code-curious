// +page.server.ts
import { error } from '@sveltejs/kit';
import lessons from '$lib/lessons.json';
import type { LessonData } from '$lib/types';

const fetchedLessons: { [key: string]: LessonData } = lessons;

export const load = async ({ params }) => {
	const lessonId: string = params.lessonId;

	const lessonData: LessonData = fetchedLessons[lessonId];

	if (!lessonData) {
		throw error(404, `Lesson ${lessonId} not found`);
	}

	return {
		lessonData,
		lessonId,
	};
};
