const engine = Matter.Engine.create();
const render = Matter.Render.create({
  element: document.querySelector('#canvas-container'),
  engine: engine,
  options: {
    width: window.innerWidth - 300, // Update initial width
    height: window.innerHeight,
    wireframes: false,
    background: 'transparent'
  }
});

const world = engine.world;

// Create walls
const walls = [
  Matter.Bodies.rectangle(render.canvas.width / 2, render.canvas.height + 30, render.canvas.width, 60, { isStatic: true }),
  Matter.Bodies.rectangle(render.canvas.width / 2, -30, render.canvas.width, 60, { isStatic: true }),
  Matter.Bodies.rectangle(-30, render.canvas.height / 2, 60, render.canvas.height, { isStatic: true }),
  Matter.Bodies.rectangle(render.canvas.width + 30, render.canvas.height / 2, 60, render.canvas.height, { isStatic: true })
];

Matter.Composite.add(world, walls);

// Mouse control setup
const mouse = Matter.Mouse.create(render.canvas);
const mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
  }
});

Matter.Composite.add(world, mouseConstraint);
render.mouse = mouse;

// Window resize handler
window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth - 300; // Update resize calculation
  render.canvas.height = window.innerHeight;
  Matter.Render.setPixelRatio(render, window.devicePixelRatio);

  // Update wall positions
  Matter.Body.setPosition(walls[0], Matter.Vector.create(render.canvas.width / 2, render.canvas.height + 30));
  Matter.Body.setPosition(walls[1], Matter.Vector.create(render.canvas.width / 2, -30));
  Matter.Body.setPosition(walls[2], Matter.Vector.create(-30, render.canvas.height / 2));
  Matter.Body.setPosition(walls[3], Matter.Vector.create(render.canvas.width + 30, render.canvas.height / 2));
});

export { engine, render, world, walls, mouse, mouseConstraint };