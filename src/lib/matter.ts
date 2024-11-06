import Matter from 'matter-js';
import type { Action, InitialBody, MatterInstance, MatterOptions, VariableType } from './types';

// Create aliases to avoid "Matter." prefixes
const { Engine, Render, World, Bodies, Runner } = Matter;

let engine: Matter.Engine | null = null;

let initialBodies: InitialBody[] = [];
let userBodies: InitialBody[] = [];

let _scale: number = 1;
// Helper function to apply scale to a pixel value
const s = (value: number) => Math.round(value * _scale);

export function initMatterJS(
	container: HTMLElement,
	options: MatterOptions,
	scale: number,
): MatterInstance | null {
	// Remove unnecessary decimal points by rounding
	_scale = scale;

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
	// Remove all user-created bodies, so that next time the simulation starts fresh
	userBodies = [];
}

// Reset all dynamic bodies to their initial positions
export function resetBodies(engine: Matter.Engine) {
	// Remove all dynamic bodies from the world
	const dynamicBodies = Matter.Composite.allBodies(engine.world).filter((body) => !body.isStatic);
	dynamicBodies.forEach((body) => {
		World.remove(engine.world, body);
	});

	// // Re-add the bodies at their initial positions
	// initialBodies.forEach((initialBody) => {
	// 	const { body, initialPosition } = initialBody;
	// 	Matter.Body.setPosition(body, initialPosition); // Reset to initial position
	// 	Matter.Body.setVelocity(body, { x: 0, y: 0 }); // Reset velocity
	// 	World.add(engine.world, body); // Add back to the world
	// });

	// Add user-created bodies to the world
	userBodies.forEach((userBody) => {
		const { body, initialPosition } = userBody;
		Matter.Body.setPosition(body, initialPosition); // Reset to initial position
		Matter.Body.setVelocity(body, { x: 0, y: 0 }); // Reset velocity
		World.add(engine.world, body); // Add back to the world
	});
}

// Define the handler function for various instructions
export function handleInstruction(
	matterInstance: MatterInstance,
	instruction: Action,
	snapshot: Record<string, any>[],
) {
	const variable = snapshot.find((item: any) => item.id === instruction.variableId) as VariableType;
	switch (instruction.action) {
		case 'drop':
			// NB presupposes that the variable is a color string
			const fill = variable.value;
			if (typeof fill === 'string') {
				const circle = Bodies.circle(s(55), s(55), s(20), {
					isStatic: false,
					restitution: 1,
					render: { fillStyle: fill },
				});
				World.add(matterInstance.engine.world, circle);
				userBodies = [
					...userBodies,
					{
						body: circle,
						initialPosition: { x: circle.position.x, y: circle.position.y },
					},
				];
			}
			break;

		// Add more case blocks for additional instructions as needed
		default:
			console.warn(`Unknown instruction type: ${instruction.action}`);
			break;
	}
}
