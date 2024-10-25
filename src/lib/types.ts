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

export interface MatterInstance {
	engine: Matter.Engine;
	runner: Matter.Runner;
}

export interface MatterOptions {
	width: number;
	height: number;
}

export interface InitialBody {
	body: Matter.Body;
	initialPosition: { x: number; y: number };
}

export interface VariableType {
	id: number;
	name: string;
	type: string;
	value: string | number | any[] | object;
}
