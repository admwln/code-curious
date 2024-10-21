export interface LessonData {
	tutorial: {
		title: string;
		description: string;
		content: string;
		nextLesson: string;
	};
	editor: {
		defaultCode: string;
	};
	console: {
		defaultCode: string[];
	};
	funnel: {
		color: string;
	};
}
