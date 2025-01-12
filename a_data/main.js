import { engine, render, world, walls } from './matterSetup.js';
import { menuEngine, menuRender } from './menuPhysics.js';
import * as spawners from './objectSpawners.js';
import { toggleMod, addCustomMod, loadCustomMods } from './modManager.js';

let hasGameStarted = localStorage.getItem('hasGameStarted') === 'true';

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
  const modManagerBtn = document.getElementById('mod-manager');
  modManagerBtn.style.opacity = hasGameStarted ? '1' : '0.5';
  modManagerBtn.style.pointerEvents = hasGameStarted ? 'auto' : 'none';
  modManagerBtn.title = hasGameStarted ? 'Open Mod Manager' : 'Play the game first to unlock Mod Manager';

  // Setup double click handler for physics objects
  render.canvas.addEventListener('dblclick', (event) => {
    const bodies = Matter.Query.point(world.bodies, {
      x: event.offsetX,
      y: event.offsetY
    });

    if (bodies.length > 0) {
      const body = bodies[0];
      if (!walls.includes(body)) {
        createExplosion(body.position.x, body.position.y, body);
      }
    }
  });

  function createExplosion(x, y, body) {
    const numParticles = 8;
    const particles = [];
    const explosionForce = 5;
    const explosionRadius = 100;

    for (let i = 0; i < numParticles; i++) {
      const angle = (Math.PI * 2 / numParticles) * i;
      const radius = 2 + Math.random() * 3;
      
      const particle = Matter.Bodies.circle(x, y, radius, {
        render: {
          fillStyle: '#FFFFFF',
          strokeStyle: '#000000',
          lineWidth: 2
        },
        frictionAir: 0.02
      });
      
      const velocity = {
        x: Math.cos(angle) * explosionForce * (0.8 + Math.random() * 0.4),
        y: Math.sin(angle) * explosionForce * (0.8 + Math.random() * 0.4)
      };
      
      Matter.Body.setVelocity(particle, velocity);
      particles.push(particle);
    }

    const bodies = Matter.Composite.allBodies(world);
    bodies.forEach(otherBody => {
      if (otherBody !== body) {
        const dx = otherBody.position.x - x;
        const dy = otherBody.position.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < explosionRadius) {
          const force = (1 - distance / explosionRadius) * explosionForce * 0.2;
          const angle = Math.atan2(dy, dx);
          Matter.Body.applyForce(otherBody, {x, y}, {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force
          });
        }
      }
    });

    Matter.Composite.add(world, particles);
    Matter.Composite.remove(world, body);
    
    setTimeout(() => {
      particles.forEach(particle => {
        Matter.Composite.remove(world, particle);
      });
    }, 1000);
  }

  // Spawn item buttons
  const spawnButtons = {
    'circle': spawners.addCircle,
    'rectangle': spawners.addRectangle,
    'triangle': spawners.addTriangle,
    'hexagon': spawners.addHexagon,
    'octagon': spawners.addOctagon,
    'star': spawners.addStar,
    'ragdoll': spawners.createRagdoll,
    'bird': spawners.createBird,
    'snake': spawners.createSnake,
    'barrel': spawners.spawnBarrel,
    'crate': spawners.spawnCrate,
    'balloon': spawners.spawnBalloon,
    'boulder': spawners.spawnBoulder,
    'spring': spawners.spawnSpring,
    'chair': spawners.spawnChair,
    'table': spawners.spawnTable,
    'vase': spawners.spawnVase,
    'woodPlank': spawners.spawnWoodPlank,
    'metalSheet': spawners.spawnMetalSheet,
    'concreteBlock': spawners.spawnConcreteBlock,
    'gear': spawners.spawnGear,
    'piston': spawners.spawnPiston,
    'motor': spawners.spawnMotor
  };

  Object.entries(spawnButtons).forEach(([id, spawner]) => {
    document.getElementById(id)?.addEventListener('click', () => {
      spawner(render.canvas.width / 2, 500);
    });
  });

  // Category switching
  document.querySelectorAll('.spawn-category').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.spawn-category').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const category = button.dataset.category;
      document.querySelectorAll('.category-items').forEach(items => {
        items.style.display = items.dataset.category === category ? 'block' : 'none';
      });
    });
  });

  // Show only default categories initially
  document.querySelectorAll('.spawn-category').forEach(button => {
    const category = button.dataset.category;
    if (['furniture', 'building', 'power'].includes(category)) {
      button.style.display = 'none';
    }
  });

  // Reset button
  document.querySelector('#reset').addEventListener('click', () => {
    const bodies = Matter.Composite.allBodies(world);
    const nonWallBodies = bodies.filter(body => !walls.includes(body));
    Matter.Composite.remove(world, nonWallBodies);
    Matter.Composite.add(world, walls);
  });

  // Menu navigation
  document.querySelector('#play').addEventListener('click', () => {
    document.querySelector('#menu').style.display = 'none';
    document.querySelector('#canvas-container').style.display = 'block';
    document.querySelector('.controls').style.display = 'flex';
    Matter.Engine.run(engine);
    Matter.Render.run(render);
    
    // Set game as started
    hasGameStarted = true;
    localStorage.setItem('hasGameStarted', 'true');
    
    // Enable mod manager button
    modManagerBtn.style.opacity = '1';
    modManagerBtn.style.pointerEvents = 'auto';
    modManagerBtn.title = 'Open Mod Manager';
  });

  document.querySelector('#mod-manager').addEventListener('click', () => {
    document.querySelector('#menu').style.display = 'none';
    document.querySelector('.mod-menu').style.display = 'flex';
  });

  document.querySelector('#back-to-menu').addEventListener('click', () => {
    document.querySelector('.mod-menu').style.display = 'none';
    document.querySelector('#menu').style.display = 'flex';
  });

  document.querySelector('#back-to-menu-game').addEventListener('click', () => {
    document.querySelector('#canvas-container').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('#menu').style.display = 'flex';
    
    Matter.Engine.clear(engine);
    Matter.Render.stop(render);
    Matter.Engine.run(menuEngine);
    Matter.Render.run(menuRender);
    
    const bodies = Matter.Composite.allBodies(world);
    const nonWallBodies = bodies.filter(body => !walls.includes(body));
    Matter.Composite.remove(world, nonWallBodies);
    Matter.Composite.add(world, walls);
  });

  // Mod system
  const modButtons = document.querySelectorAll('.mod-button');
  modButtons.forEach(button => {
    button.addEventListener('click', () => {
      toggleMod(button.dataset.modId);
    });
  });

  // Custom mod form handling
  const addModButton = document.querySelector('.add-mod-button');
  const modForm = document.querySelector('.add-mod-form');
  const saveModButton = document.querySelector('#save-mod');
  const cancelModButton = document.querySelector('#cancel-mod');

  addModButton.addEventListener('click', () => {
    modForm.style.display = 'block';
    addModButton.style.display = 'none';
  });

  saveModButton.addEventListener('click', () => {
    const name = document.querySelector('#mod-name').value.trim();
    const description = document.querySelector('#mod-description').value.trim();
    
    if (name && description) {
      addCustomMod(name, description);
      modForm.style.display = 'none';
      addModButton.style.display = 'block';
      document.querySelector('#mod-name').value = '';
      document.querySelector('#mod-description').value = '';
    }
  });

  cancelModButton.addEventListener('click', () => {
    modForm.style.display = 'none';
    addModButton.style.display = 'block';
    document.querySelector('#mod-name').value = '';
    document.querySelector('#mod-description').value = '';
  });

  // Load custom mods
  loadCustomMods();
});
