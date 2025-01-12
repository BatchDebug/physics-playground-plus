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

  const bodies = Matter.Composite.allBodies(menuEngine.world);
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

  Matter.Composite.add(menuEngine.world, particles);
  Matter.Composite.remove(menuEngine.world, body);
  
  setTimeout(() => {
    particles.forEach(particle => {
      Matter.Composite.remove(menuEngine.world, particle);
    });
  }, 1000);
}

function spawnMenuBlock() {
  for(let i = 0; i < 3; i++) {
    const x = Math.random() * window.innerWidth;
    const isHuman = Math.random() < 0.3;
    
    if (isHuman) {
      const y = -100;
      const group = Matter.Body.nextGroup(false);
      const torsoWidth = 30;
      const torsoHeight = 50;
      const headRadius = 15;
      const limbWidth = 15;
      const limbLength = 35;

      const torso = Matter.Bodies.rectangle(x, y, torsoWidth, torsoHeight, {
        collisionFilter: {group: group},
        render: {
          fillStyle: '#FFFFFF',
          strokeStyle: '#000000',
          lineWidth: 3
        }
      });

      const head = Matter.Bodies.circle(x, y - torsoHeight/2 - headRadius, headRadius, {
        collisionFilter: {group: group},
        render: {
          fillStyle: '#FFFFFF',
          strokeStyle: '#000000', 
          lineWidth: 3
        }
      });

      const leftArm = Matter.Bodies.rectangle(x - torsoWidth/2 - limbWidth/2, y - torsoHeight/4, limbWidth, limbLength, {
        collisionFilter: {group: group},
        render: {
          fillStyle: '#FFFFFF',
          strokeStyle: '#000000',
          lineWidth: 3
        }
      });

      const rightArm = Matter.Bodies.rectangle(x + torsoWidth/2 + limbWidth/2, y - torsoHeight/4, limbWidth, limbLength, {
        collisionFilter: {group: group},
        render: {
          fillStyle: '#FFFFFF',
          strokeStyle: '#000000', 
          lineWidth: 3
        }
      });

      const leftLeg = Matter.Bodies.rectangle(x - torsoWidth/4, y + torsoHeight/2 + limbLength/2, limbWidth, limbLength, {
        collisionFilter: {group: group},
        render: {
          fillStyle: '#FFFFFF',
          strokeStyle: '#000000',
          lineWidth: 3
        }
      });

      const rightLeg = Matter.Bodies.rectangle(x + torsoWidth/4, y + torsoHeight/2 + limbLength/2, limbWidth, limbLength, {
        collisionFilter: {group: group},
        render: {
          fillStyle: '#FFFFFF',
          strokeStyle: '#000000',
          lineWidth: 3
        }
      });

      const neckConstraint = Matter.Constraint.create({
        bodyA: head,
        bodyB: torso,
        pointA: { x: 0, y: headRadius },
        pointB: { x: 0, y: -torsoHeight/2 },
        stiffness: 0.6,
        render: { visible: false }
      });

      const leftShoulderConstraint = Matter.Constraint.create({
        bodyA: torso,
        bodyB: leftArm,
        pointA: { x: -torsoWidth/2, y: -torsoHeight/4 },
        pointB: { x: limbWidth/2, y: 0 },
        stiffness: 0.6,
        render: { visible: false }
      });

      const rightShoulderConstraint = Matter.Constraint.create({
        bodyA: torso,
        bodyB: rightArm,
        pointA: { x: torsoWidth/2, y: -torsoHeight/4 },
        pointB: { x: -limbWidth/2, y: 0 },
        stiffness: 0.6,
        render: { visible: false }
      });

      const leftHipConstraint = Matter.Constraint.create({
        bodyA: torso,
        bodyB: leftLeg,
        pointA: { x: -torsoWidth/4, y: torsoHeight/2 },
        pointB: { x: 0, y: -limbLength/2 },
        stiffness: 0.6,
        render: { visible: false }
      });

      const rightHipConstraint = Matter.Constraint.create({
        bodyA: torso,
        bodyB: rightLeg,
        pointA: { x: torsoWidth/4, y: torsoHeight/2 },
        pointB: { x: 0, y: -limbLength/2 },
        stiffness: 0.6,
        render: { visible: false }
      });

      const ragdoll = Matter.Composite.create({
        bodies: [torso, head, leftArm, rightArm, leftLeg, rightLeg],
        constraints: [neckConstraint, leftShoulderConstraint, rightShoulderConstraint, leftHipConstraint, rightHipConstraint]
      });

      Matter.Composite.add(menuEngine.world, ragdoll);

      Matter.Events.on(menuEngine, 'afterUpdate', () => {
        if (torso.position.y > window.innerHeight + 200) {
          Matter.Composite.remove(menuEngine.world, ragdoll);
        }
        
        if (Math.random() < 0.001) { 
          createExplosion(torso.position.x, torso.position.y, ragdoll);
        }
      });

    } else {
      const size = 20 + Math.random() * 30;
      const shape = Math.random() < 0.33 ? 'circle' : Math.random() < 0.5 ? 'rectangle' : 'triangle';
      let block;
      
      if (shape === 'circle') {
        block = Matter.Bodies.circle(x, -50, size / 2, {
          restitution: 0.6,
          render: {
            fillStyle: '#FFFFFF',
            strokeStyle: '#000000',
            lineWidth: 3
          }
        });
      } else if (shape === 'rectangle') {
        block = Matter.Bodies.rectangle(x, -50, size, size, {
          restitution: 0.6,
          render: {
            fillStyle: '#FFFFFF',
            strokeStyle: '#000000',
            lineWidth: 3
          }
        });
      } else {
        block = Matter.Bodies.polygon(x, -50, 3, size / 2, {
          restitution: 0.6,
          render: {
            fillStyle: '#FFFFFF',
            strokeStyle: '#000000',
            lineWidth: 3
          }
        });
      }
      
      Matter.Composite.add(menuEngine.world, block);
      
      Matter.Events.on(menuEngine, 'afterUpdate', () => {
        if (block.position.y > window.innerHeight + 200) {
          Matter.Composite.remove(menuEngine.world, block);
        }
        if (Math.random() < 0.001) {
          createExplosion(block.position.x, block.position.y, block);
        }
      });
    }
  }
}

const menuEngine = Matter.Engine.create();
const menuRender = Matter.Render.create({
  element: document.querySelector('.menu'),
  engine: menuEngine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: 'transparent'
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const menuGround = Matter.Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight + 30,
    window.innerWidth,
    60,
    {
      isStatic: true,
      render: {
        fillStyle: '#FFFFFF',
        strokeStyle: '#000000',
        lineWidth: 3
      }
    }
  );
  
  Matter.Composite.add(menuEngine.world, menuGround);
  Matter.Engine.run(menuEngine);
  Matter.Render.run(menuRender);
  setInterval(spawnMenuBlock, 100);
});

export { menuEngine, menuRender };