export interface LessonData {
	tutorial: {
		title: string;
		content: string[];
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
	value: string | boolean | number | any[] | object;
}

export interface StringVariable {
	id: number;
	name: string;
	type: string;
	value: string;
}

export interface NumberVariable {
	id: number;
	name: string;
	type: string;
	value: number;
}

export interface BooleanVariable {
	id: number;
	name: string;
	type: string;
	value: boolean;
}

export interface ArrayVariable {
	id: number;
	name: string;
	type: string;
	itemType: string;
	value: any[];
}

export interface ObjectVariable {
	id: number;
	name: string;
	type: string;
	value: object;
}
