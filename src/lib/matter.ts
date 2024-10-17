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
			wireframes: false,
			// background: 'rgb(23 23 23)',
			background: 'rgb(30 30 30)',
		},
	});

	// Create a circle body
	const circle = Bodies.circle(100, 100, 25, {
		isStatic: false, // Static bodies are not affected by gravity
		restitution: 1, // Bounce effect
		render: { fillStyle: 'rgb(99 102 241)' }, // Circle color
	});
	const circle2 = Bodies.circle(100, 100, 25, {
		isStatic: false, // Static bodies are not affected by gravity
		restitution: 1, // Bounce effect
		render: { fillStyle: 'rgb(99 102 241)' }, // Circle color
	});
	const circle3 = Bodies.circle(100, 100, 25, {
		isStatic: false, // Static bodies are not affected by gravity
		restitution: 1, // Bounce effect
		render: { fillStyle: 'rgb(99 102 241)' }, // Circle color
	});
	// Add the circle to the world
	World.add(engine.world, [circle, circle2, circle3]);

	// Create static walls
	World.add(engine.world, [
		Bodies.rectangle(225, 0, 450, 50, { isStatic: true, render: { fillStyle: 'rgb(23 23 23)' } }),
		Bodies.rectangle(225, 700, 450, 50, { isStatic: true, render: { fillStyle: 'rgb(23 23 23)' } }),
		Bodies.rectangle(450, 350, 50, 700, { isStatic: true, render: { fillStyle: 'rgb(23 23 23)' } }),
		Bodies.rectangle(0, 350, 50, 700, { isStatic: true, render: { fillStyle: 'rgb(23 23 23)' } }),
	]);

	// // Add a mouse constraint
	// const mouse = Matter.Mouse.create(render.canvas);
	// const mouseConstraint = Matter.MouseConstraint.create(engine, {
	// 	mouse: mouse,
	// 	constraint: {
	// 		stiffness: 0.2,
	// 		render: {
	// 			visible: false,
	// 		},
	// 	},
	// });
	// World.add(engine.world, mouseConstraint);

	// Create a runner
	const runner = Runner.create();

	// Run the engine using the runner
	Runner.run(runner, engine);

	// Run the renderer
	Render.run(render);
}
