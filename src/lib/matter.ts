import Matter from 'matter-js';

// Create aliases to avoid "Matter." prefixes
const { Engine, Render, World, Bodies, Runner } = Matter;

interface MatterOptions {
	width?: number;
	height?: number;
}

export function initMatterJS(container: HTMLElement, options: MatterOptions = {}): void {
	const engine = Engine.create();

	const render = Render.create({
		element: container,
		engine: engine,
		options: {
			width: options.width || container.clientWidth,
			height: options.height || container.clientHeight,
			wireframes: false
		}
	});

	// Create a circle body
	const circle = Bodies.circle(100, 100, 50, {
		isStatic: false, // Static bodies are not affected by gravity
		restitution: 0.9, // Bounce effect
		render: { fillStyle: 'blue' } // Circle color
	});

	// Add the circle to the world
	World.add(engine.world, [circle]);

	// Create a runner
	const runner = Runner.create();

	// Run the engine using the runner
	Runner.run(runner, engine);

	// Run the renderer
	Render.run(render);
}
