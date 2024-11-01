export interface LessonData {
	tutorial: {
		title: string;
		content: string[];
		prevLesson: string | null;
		nextLesson: string | null;
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

export interface ConsoleData {
	defaultCode: string[];
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
	blockType: string;
	id: number;
	name: string;
	type: string;
	value: string | boolean | number | any[] | object;
}

export interface StringVariable {
	blockType: string;
	id: number;
	name: string;
	type: string;
	value: string;
}

export interface NumberVariable {
	blockType: string;
	id: number;
	name: string;
	type: string;
	value: number;
}

export interface BooleanVariable {
	blockType: string;
	id: number;
	name: string;
	type: string;
	value: boolean;
}

export interface ArrayVariable {
	blockType: string;
	id: number;
	name: string;
	type: string;
	itemType: string;
	value: any[];
}

export interface ObjectVariable {
	blockType: string;
	id: number;
	name: string;
	type: string;
	value: Record<string, any>;
}

export interface LogBlock {
	blockType: string;
	id: number;
	message?: string;
	selectedId: number | null;
	selectedType?: string;
	selectedIndex: number | null;
	selectedKey: string | null;
	useIndex: boolean;
	useKey: boolean;
}
