import Matter from 'matter-js';

// Create aliases to avoid "Matter." prefixes
const { Engine, Render, World, Bodies, Runner } = Matter;

export interface MatterInstance {
	engine: Matter.Engine;
	runner: Matter.Runner;
}

interface MatterOptions {
	width?: number;
	height?: number;
}

interface InitialBody {
	body: Matter.Body;
	initialPosition: { x: number; y: number };
}

let engine: Matter.Engine | null = null;

let initialBodies: InitialBody[] = [];

export function initMatterJS(
	container: HTMLElement,
	options: MatterOptions = {},
	circleColor: string,
) {
	// First, check if there is any existing eninge
	if (engine) {
		Matter.World.clear(engine.world, false); // Clear existing bodies, 'false' removes static bodies as well as dynamic
		Matter.Engine.clear(engine); // Clear the engine itself
	}

	engine = Engine.create();
	const render = Render.create({
		element: container,
		engine: engine,
		options: {
			width: options.width || container.clientWidth,
			height: options.height || container.clientHeight,
			wireframes: false,
			background: 'rgb(30 30 30)', // Adjust background color
		},
	});

	// Create a circle body
	const circle = Bodies.circle(55, 55, 20, {
		isStatic: false,
		restitution: 1,
		render: { fillStyle: circleColor },
	});

	// Add the bodies to the world
	World.add(engine.world, [circle]);

	// Store initial state of dynamic bodies
	initialBodies = [
		{
			body: circle,
			initialPosition: { x: circle.position.x, y: circle.position.y },
		},
	];

	// Create static walls
	World.add(engine.world, [
		Bodies.rectangle(225, 0, 450, 50, { isStatic: true, render: { fillStyle: 'rgb(23 23 23)' } }),
		Bodies.rectangle(225, 700, 450, 50, { isStatic: true, render: { fillStyle: 'rgb(23 23 23)' } }),
		Bodies.rectangle(450, 350, 50, 700, { isStatic: true, render: { fillStyle: 'rgb(23 23 23)' } }),
		Bodies.rectangle(0, 350, 50, 700, { isStatic: true, render: { fillStyle: 'rgb(23 23 23)' } }),
	]);

	// Create four static narrow rectangles positioned in a funnel shape
	World.add(engine.world, [
		Bodies.rectangle(30, 120, 450, 10, {
			isStatic: true,
			render: { fillStyle: 'rgb(23 23 23)' },
			angle: Math.PI * 0.25,
		}),
		Bodies.rectangle(420, 120, 450, 10, {
			isStatic: true,
			render: { fillStyle: 'rgb(23 23 23)' },
			angle: Math.PI * -0.25,
		}),
		Bodies.rectangle(190, 400, 10, 250, { isStatic: true, render: { fillStyle: 'rgb(23 23 23)' } }),
		Bodies.rectangle(260, 400, 10, 250, { isStatic: true, render: { fillStyle: 'rgb(23 23 23)' } }),
	]);

	// Create a runner
	const runner = Runner.create();

	// Run the renderer
	Render.run(render);

	// Return the engine and runner so we can control them externally
	return { engine, runner };
}

export function startMatter(runner: Matter.Runner, engine: Matter.Engine) {
	Runner.run(runner, engine);
}

export function stopMatter(runner: Matter.Runner) {
	Runner.stop(runner);
}

// Reset all dynamic bodies to their initial positions
export function resetBodies(engine: Matter.Engine) {
	// Remove all dynamic bodies from the world
	const dynamicBodies = Matter.Composite.allBodies(engine.world).filter((body) => !body.isStatic);
	dynamicBodies.forEach((body) => {
		World.remove(engine.world, body);
	});

	// Re-add the bodies at their initial positions
	initialBodies.forEach((initialBody) => {
		const { body, initialPosition } = initialBody;
		Matter.Body.setPosition(body, initialPosition); // Reset to initial position
		Matter.Body.setVelocity(body, { x: 0, y: 0 }); // Reset velocity
		World.add(engine.world, body); // Add back to the world
	});
}
