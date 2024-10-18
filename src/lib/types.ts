export interface LessonData {
	id: string;
	tutorial: {
		title: string;
		description: string;
		topics: { name: string }[];
		exampleCode: string;
		nextLesson: string;
	};
	editor: {
		defaultCode: string;
	};
	console: {
		defaultCode: string;
	};
	funnel: {
		color: string;
	};
}
