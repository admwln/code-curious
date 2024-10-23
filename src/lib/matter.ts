import Matter from 'matter-js';
import type { MatterOptions, InitialBody } from './types';

// Create aliases to avoid "Matter." prefixes
const { Engine, Render, World, Bodies, Runner } = Matter;

let engine: Matter.Engine | null = null;

let initialBodies: InitialBody[] = [];

export function initMatterJS(
	container: HTMLElement,
	options: MatterOptions,
	circleColor: string,
	scale: number,
) {
	// Helper function to apply scale to a pixel value
	// Remove unnecessary decimal points by rounding
	const s = (value: number) => Math.round(value * scale);

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
			width: s(options.width),
			height: s(options.height),
			wireframes: false,
			background: 'rgb(30 30 30)', // Adjust background color
		},
	});

	// Create a circle body
	const circle = Bodies.circle(s(55), s(55), s(20), {
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
		Bodies.rectangle(s(225), s(0), s(450), s(50), {
			isStatic: true,
			render: { fillStyle: 'rgb(30, 30, 30' },
		}),
		Bodies.rectangle(s(225), s(700), s(450), s(50), {
			isStatic: true,
			render: { fillStyle: 'rgb(30, 30, 30' },
		}),
		Bodies.rectangle(s(450), s(350), s(50), s(700), {
			isStatic: true,
			render: { fillStyle: 'rgb(30, 30, 30' },
		}),
		Bodies.rectangle(s(0), s(350), s(50), s(700), {
			isStatic: true,
			render: { fillStyle: 'rgb(30, 30, 30' },
		}),
	]);

	// Create four static narrow rectangles positioned in a funnel shape
	World.add(engine.world, [
		Bodies.rectangle(s(30), s(120), s(450), s(10), {
			isStatic: true,
			render: { fillStyle: 'rgb(23 23 23)' },
			angle: Math.PI * 0.25,
		}),
		Bodies.rectangle(s(420), s(120), s(450), s(10), {
			isStatic: true,
			render: { fillStyle: 'rgb(23 23 23)' },
			angle: Math.PI * -0.25,
		}),
		Bodies.rectangle(s(190), s(400), s(10), s(250), {
			isStatic: true,
			render: { fillStyle: 'rgb(23 23 23)' },
		}),
		Bodies.rectangle(s(260), s(400), s(10), s(250), {
			isStatic: true,
			render: { fillStyle: 'rgb(23 23 23)' },
		}),
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
