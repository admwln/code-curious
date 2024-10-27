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

export interface StringVariable {
	id: number;
	name: string;
	type: 'string';
	value: string;
}

export interface NumberVariable {
	id: number;
	name: string;
	type: 'number';
	value: number;
}

export interface BooleanVariable {
	id: number;
	name: string;
	type: 'boolean';
	value: string;
}

export interface ArrayVariable {
	id: number;
	name: string;
	type: 'array';
	itemType: string;
	value: any[];
}

export interface ObjectVariable {
	id: number;
	keys: string[];
	name: string;
	type: 'object';
	value: object;
}
