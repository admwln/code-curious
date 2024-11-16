import Matter from 'matter-js';
import type { Action, InitialBody, MatterInstance, MatterOptions, VariableType } from './types';
import { colors } from './utils/colors';
import { consoleOutput } from './utils/consoleActions';
import type { Log } from './types';
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
		Bodies.rectangle(s(225), s(-50), s(450), s(5), {
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
	// World.add(engine.world, [
	// 	Bodies.rectangle(s(30), s(120), s(450), s(10), {
	// 		isStatic: true,
	// 		render: { fillStyle: 'rgb(23 23 23)' },
	// 		angle: Math.PI * 0.25,
	// 	}),
	// 	Bodies.rectangle(s(420), s(120), s(450), s(10), {
	// 		isStatic: true,
	// 		render: { fillStyle: 'rgb(23 23 23)' },
	// 		angle: Math.PI * -0.25,
	// 	}),
	// 	Bodies.rectangle(s(190), s(400), s(10), s(250), {
	// 		isStatic: true,
	// 		render: { fillStyle: 'rgb(23 23 23)' },
	// 	}),
	// 	Bodies.rectangle(s(260), s(400), s(10), s(250), {
	// 		isStatic: true,
	// 		render: { fillStyle: 'rgb(23 23 23)' },
	// 	}),
	// ]);

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

const checkColor = (value: string) => {
	// Remove all spaces, if any, from variable.value
	let color: string = value.replace(/\s/g, '');
	// Check if the variable value is a valid color
	try {
		if (!colors[color]) {
			throw new Error(`Huh? Unrecognized color value: ${color}`);
		}
	} catch (error: any) {
		// Capture and log error to the Console component
		// Create a new log block with the error message
		const errorBlock: Log = {
			id: Date.now(),
			blockType: 'log',
			message: `Error: ${error.message}`,
			selectedId: null,
			selectedIndex: 0,
			selectedKey: null,
			useIndex: false,
			useKey: false,
			selectedType: 'string',
		};
		consoleOutput.update((output) => [...output, errorBlock]);
	}
	return (color = color.replace(/\s/g, ''));
};

// Define the handler function for various instructions
export function handleInstruction(
	matterInstance: MatterInstance,
	instruction: Action,
	snapshot: Record<string, any>[],
) {
	const variable = snapshot.find((item: any) => item.id === instruction.variableId) as VariableType;
	switch (instruction.action) {
		case 'create circle':
			console.log('matter.ts: create circle action has been called');
			let circleFill = variable.value as string;
			circleFill = checkColor(circleFill);
			if (typeof circleFill === 'string') {
				const circle = Bodies.circle(s(225), s(0), s(40), {
					isStatic: false,
					restitution: 1,
					friction: 0,
					render: { fillStyle: circleFill },
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
		case 'create square':
			console.log('matter.ts: create square action has been called');
			let squareFill = variable.value as string;
			squareFill = checkColor(squareFill);
			if (typeof squareFill === 'string') {
				const square = Bodies.rectangle(s(225), s(0), s(80), s(80), {
					isStatic: false,
					restitution: 0.95,
					friction: 0.25,
					render: { fillStyle: squareFill },
				});
				World.add(matterInstance.engine.world, square);
				userBodies = [
					...userBodies,
					{
						body: square,
						initialPosition: { x: square.position.x, y: square.position.y },
					},
				];
			}
			break;
		case 'create triangle':
			console.log('matter.ts: create triangle action has been called');
			let triangleFill = variable.value as string;
			triangleFill = checkColor(triangleFill);
			if (typeof triangleFill === 'string') {
				const triangle = Bodies.polygon(s(225), s(0), 3, s(50), {
					isStatic: false,
					restitution: 0.5,
					friction: 0.5,
					render: { fillStyle: triangleFill },
				});

				// Rotate the triangle by 90 degrees (π/2 radians) to align its flat side with the floor
				Matter.Body.setAngle(triangle, Math.PI / 2);

				World.add(matterInstance.engine.world, triangle);
				userBodies = [
					...userBodies,
					{
						body: triangle,
						initialPosition: { x: triangle.position.x, y: triangle.position.y },
					},
				];
			}
			break;
		case 'create circles':
			console.log('matter.ts: create circles action has been called');
			let circleFills = variable.value as string[];

			circleFills.forEach((fill, i) => {
				let circleFill = checkColor(fill);

				if (typeof fill === 'string') {
					const xPosition = s(50 + i * 85);

					// Adjusted random values for density and air resistance
					const randomDensity = Math.random() * 0.003 + 0.002; // Min density: 0.002, Max density: 0.005
					const randomFrictionAir = Math.random() * 0.02 + 0.005; // Min frictionAir: 0.005, Max frictionAir: 0.025

					// Create the circle with adjusted properties
					const circle = Bodies.circle(xPosition, s(0), s(40), {
						isStatic: false,
						restitution: 1,
						friction: 0,
						density: randomDensity, // Adjusted density range
						frictionAir: randomFrictionAir, // Adjusted air resistance range
						render: { fillStyle: circleFill },
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
			});
			break;

		default:
			console.warn(`Unknown instruction type: ${instruction.action}`);
			break;
	}
}
