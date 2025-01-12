import { engine, world } from './matterSetup.js';
import { render } from './matterSetup.js';

// Original shapes
export function addCircle(x, y) {
  const circle = Matter.Bodies.circle(x, y, 20 + Math.random() * 30, {
    restitution: 0.8,
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  Matter.Composite.add(world, circle);
}

export function addRectangle(x, y) {
  const rectangle = Matter.Bodies.rectangle(x, y, 40 + Math.random() * 40, 40 + Math.random() * 40, {
    restitution: 0.8,
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  Matter.Composite.add(world, rectangle);
}

export function addTriangle(x, y) {
  const triangle = Matter.Bodies.polygon(x, y, 3, 30 + Math.random() * 20, {
    restitution: 0.8,
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  Matter.Composite.add(world, triangle);
}

// New block shapes
export function addHexagon(x, y) {
  const hexagon = Matter.Bodies.polygon(x, y, 6, 25 + Math.random() * 15, {
    restitution: 0.8,
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  Matter.Composite.add(world, hexagon);
}

export function addOctagon(x, y) {
  const octagon = Matter.Bodies.polygon(x, y, 8, 25 + Math.random() * 15, {
    restitution: 0.8,
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  Matter.Composite.add(world, octagon);
}

export function addStar(x, y) {
  const star = Matter.Bodies.polygon(x, y, 5, 30 + Math.random() * 20, {
    restitution: 0.8,
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  Matter.Composite.add(world, star);
}

// Life forms
export function createRagdoll(x, y) {
  const group = Matter.Body.nextGroup(false);
  const torsoWidth = 30;
  const torsoHeight = 60;
  const headRadius = 15;
  const upperArmWidth = 12;
  const upperArmLength = 25;
  const lowerArmWidth = 10;
  const lowerArmLength = 20;
  const upperLegWidth = 12;
  const upperLegLength = 30;
  const lowerLegWidth = 10;
  const lowerLegLength = 25;
  const torso = Matter.Bodies.rectangle(x, y, torsoWidth, torsoHeight, {
    collisionFilter: {
      group: group
    },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  const head = Matter.Bodies.circle(x, y - torsoHeight / 2 - headRadius, headRadius, {
    collisionFilter: {
      group: group
    },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  const leftUpperArm = Matter.Bodies.rectangle(x - torsoWidth / 2 - upperArmWidth / 2, y - torsoHeight / 3, upperArmWidth, upperArmLength, {
    collisionFilter: {
      group: group
    },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  const leftLowerArm = Matter.Bodies.rectangle(x - torsoWidth / 2 - upperArmWidth / 2, y - torsoHeight / 3 + upperArmLength, lowerArmWidth, lowerArmLength, {
    collisionFilter: {
      group: group
    },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  const rightUpperArm = Matter.Bodies.rectangle(x + torsoWidth / 2 + upperArmWidth / 2, y - torsoHeight / 3, upperArmWidth, upperArmLength, {
    collisionFilter: {
      group: group
    },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  const rightLowerArm = Matter.Bodies.rectangle(x + torsoWidth / 2 + upperArmWidth / 2, y - torsoHeight / 3 + upperArmLength, lowerArmWidth, lowerArmLength, {
    collisionFilter: {
      group: group
    },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  const leftUpperLeg = Matter.Bodies.rectangle(x - torsoWidth / 4, y + torsoHeight / 2 + upperLegLength / 2, upperLegWidth, upperLegLength, {
    collisionFilter: {
      group: group
    },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  const leftLowerLeg = Matter.Bodies.rectangle(x - torsoWidth / 4, y + torsoHeight / 2 + upperLegLength + lowerLegLength / 2, lowerLegWidth, lowerLegLength, {
    collisionFilter: {
      group: group
    },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  const rightUpperLeg = Matter.Bodies.rectangle(x + torsoWidth / 4, y + torsoHeight / 2 + upperLegLength / 2, upperLegWidth, upperLegLength, {
    collisionFilter: {
      group: group
    },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  const rightLowerLeg = Matter.Bodies.rectangle(x + torsoWidth / 4, y + torsoHeight / 2 + upperLegLength + lowerLegLength / 2, lowerLegWidth, lowerLegLength, {
    collisionFilter: {
      group: group
    },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  const neckConstraint = Matter.Constraint.create({
    bodyA: head,
    bodyB: torso,
    pointA: {
      x: 0,
      y: headRadius
    },
    pointB: {
      x: 0,
      y: -torsoHeight / 2
    },
    stiffness: 0.6,
    render: {
      visible: false
    }
  });
  const leftShoulderConstraint = Matter.Constraint.create({
    bodyA: torso,
    bodyB: leftUpperArm,
    pointA: {
      x: -torsoWidth / 2,
      y: -torsoHeight / 3
    },
    pointB: {
      x: upperArmWidth / 2,
      y: 0
    },
    stiffness: 0.6,
    render: {
      visible: false
    }
  });
  const leftElbowConstraint = Matter.Constraint.create({
    bodyA: leftUpperArm,
    bodyB: leftLowerArm,
    pointA: {
      x: 0,
      y: upperArmLength / 2
    },
    pointB: {
      x: 0,
      y: -lowerArmLength / 2
    },
    stiffness: 0.6,
    render: {
      visible: false
    }
  });
  const rightShoulderConstraint = Matter.Constraint.create({
    bodyA: torso,
    bodyB: rightUpperArm,
    pointA: {
      x: torsoWidth / 2,
      y: -torsoHeight / 3
    },
    pointB: {
      x: -upperArmWidth / 2,
      y: 0
    },
    stiffness: 0.6,
    render: {
      visible: false
    }
  });
  const rightElbowConstraint = Matter.Constraint.create({
    bodyA: rightUpperArm,
    bodyB: rightLowerArm,
    pointA: {
      x: 0,
      y: upperArmLength / 2
    },
    pointB: {
      x: 0,
      y: -lowerArmLength / 2
    },
    stiffness: 0.6,
    render: {
      visible: false
    }
  });
  const leftHipConstraint = Matter.Constraint.create({
    bodyA: torso,
    bodyB: leftUpperLeg,
    pointA: {
      x: -torsoWidth / 4,
      y: torsoHeight / 2
    },
    pointB: {
      x: 0,
      y: -upperLegLength / 2
    },
    stiffness: 0.6,
    render: {
      visible: false
    }
  });
  const leftKneeConstraint = Matter.Constraint.create({
    bodyA: leftUpperLeg,
    bodyB: leftLowerLeg,
    pointA: {
      x: 0,
      y: upperLegLength / 2
    },
    pointB: {
      x: 0,
      y: -lowerLegLength / 2
    },
    stiffness: 0.6,
    render: {
      visible: false
    }
  });
  const rightHipConstraint = Matter.Constraint.create({
    bodyA: torso,
    bodyB: rightUpperLeg,
    pointA: {
      x: torsoWidth / 4,
      y: torsoHeight / 2
    },
    pointB: {
      x: 0,
      y: -upperLegLength / 2
    },
    stiffness: 0.6,
    render: {
      visible: false
    }
  });
  const rightKneeConstraint = Matter.Constraint.create({
    bodyA: rightUpperLeg,
    bodyB: rightLowerLeg,
    pointA: {
      x: 0,
      y: upperLegLength / 2
    },
    pointB: {
      x: 0,
      y: -lowerLegLength / 2
    },
    stiffness: 0.6,
    render: {
      visible: false
    }
  });
  const leftFootSensor = Matter.Bodies.rectangle(x - torsoWidth / 4, y + torsoHeight / 2 + upperLegLength + lowerLegLength + 5, lowerLegWidth, 10, {
    isSensor: true,
    render: {
      visible: false
    }
  });
  const rightFootSensor = Matter.Bodies.rectangle(x + torsoWidth / 4, y + torsoHeight / 2 + upperLegLength + lowerLegLength + 5, lowerLegWidth, 10, {
    isSensor: true,
    render: {
      visible: false
    }
  });
  Matter.Body.set(leftFootSensor, "collisionFilter", {
    group: group
  });
  Matter.Body.set(rightFootSensor, "collisionFilter", {
    group: group
  });
  const leftFootConstraint = Matter.Constraint.create({
    bodyA: leftLowerLeg,
    bodyB: leftFootSensor,
    pointA: {
      x: 0,
      y: lowerLegLength / 2
    },
    pointB: {
      x: 0,
      y: -5
    },
    stiffness: 1,
    render: {
      visible: false
    }
  });
  const rightFootConstraint = Matter.Constraint.create({
    bodyA: rightLowerLeg,
    bodyB: rightFootSensor,
    pointA: {
      x: 0,
      y: lowerLegLength / 2
    },
    pointB: {
      x: 0,
      y: -5
    },
    stiffness: 1,
    render: {
      visible: false
    }
  });
  Matter.Composite.add(world, [torso, head, leftUpperArm, leftLowerArm, rightUpperArm, rightLowerArm, leftUpperLeg, leftLowerLeg, rightUpperLeg, rightLowerLeg, neckConstraint, leftShoulderConstraint, leftElbowConstraint, rightShoulderConstraint, rightElbowConstraint, leftHipConstraint, leftKneeConstraint, rightHipConstraint, rightKneeConstraint, leftFootSensor, rightFootSensor, leftFootConstraint, rightFootConstraint]);
}

export function createBird(x, y) {
  const group = Matter.Body.nextGroup(false);
  const body = Matter.Bodies.circle(x, y, 15, {
    collisionFilter: { group },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  
  const wing1 = Matter.Bodies.rectangle(x - 20, y, 20, 10, {
    collisionFilter: { group },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  
  const wing2 = Matter.Bodies.rectangle(x + 20, y, 20, 10, {
    collisionFilter: { group },
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  
  const constraint1 = Matter.Constraint.create({
    bodyA: body,
    bodyB: wing1,
    stiffness: 0.8,
    render: { visible: false }
  });
  
  const constraint2 = Matter.Constraint.create({
    bodyA: body,
    bodyB: wing2,
    stiffness: 0.8,
    render: { visible: false }
  });
  
  Matter.Composite.add(world, [body, wing1, wing2, constraint1, constraint2]);
}

export function createSnake(x, y) {
  const group = Matter.Body.nextGroup(false);
  const segments = [];
  const constraints = [];
  const numSegments = 8;
  
  for (let i = 0; i < numSegments; i++) {
    const segment = Matter.Bodies.circle(x + (i * 20), y, 10, {
      collisionFilter: { group },
      render: {
        fillStyle: '#FFFFFF',
        strokeStyle: '#000000',
        lineWidth: 3
      }
    });
    segments.push(segment);
    
    if (i > 0) {
      const constraint = Matter.Constraint.create({
        bodyA: segments[i-1],
        bodyB: segment,
        stiffness: 0.8,
        render: { visible: false }
      });
      constraints.push(constraint);
    }
  }
  
  Matter.Composite.add(world, [...segments, ...constraints]);
}

// Props
export function spawnChair(x, y) {
  const seatHeight = 40;
  const seatWidth = 40; 
  const backrestHeight = 40; 
  const legThickness = 6;
  const cushionHeight = 8;

  // Create chair parts
  const seat = Matter.Bodies.rectangle(x, y, seatWidth, seatHeight/2, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  const backrest = Matter.Bodies.rectangle(x, y - backrestHeight/2 - 5, seatWidth/1.5, backrestHeight, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000', 
      lineWidth: 3
    }
  });

  // Add cushion
  const cushion = Matter.Bodies.rectangle(x, y - cushionHeight/2, seatWidth-4, cushionHeight, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 2
    }
  });

  const legs = [
    Matter.Bodies.rectangle(x - seatWidth/3, y + seatHeight/2, legThickness, seatHeight, {
      render: {
        fillStyle: '#FFFFFF',
        strokeStyle: '#000000',
        lineWidth: 3
      }
    }),
    Matter.Bodies.rectangle(x + seatWidth/3, y + seatHeight/2, legThickness, seatHeight, {
      render: {
        fillStyle: '#FFFFFF',
        strokeStyle: '#000000', 
        lineWidth: 3
      }
    })
  ];

  const chair = Matter.Body.create({
    parts: [seat, backrest, cushion, ...legs],
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  Matter.Composite.add(world, chair);
}

export function spawnTable(x, y) {
  const tableWidth = 100;
  const tableHeight = 60;
  const legThickness = 8;
  const legHeight = 50;
  const supportBeamHeight = 6;

  const tabletop = Matter.Bodies.rectangle(x, y, tableWidth, tableHeight/3, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  // Add support beam
  const supportBeam = Matter.Bodies.rectangle(x, y + legHeight/3, tableWidth-20, supportBeamHeight, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 2
    }
  });

  const legs = [
    Matter.Bodies.rectangle(x - tableWidth/3, y + legHeight/2, legThickness, legHeight, {
      render: {
        fillStyle: '#FFFFFF',
        strokeStyle: '#000000',
        lineWidth: 3
      }
    }),
    Matter.Bodies.rectangle(x + tableWidth/3, y + legHeight/2, legThickness, legHeight, {
      render: {
        fillStyle: '#FFFFFF',
        strokeStyle: '#000000',
        lineWidth: 3
      }
    })
  ];

  const table = Matter.Body.create({
    parts: [tabletop, supportBeam, ...legs],
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',  
      lineWidth: 3  
    }
  });

  Matter.Composite.add(world, table);
}

export function spawnVase(x, y) {
  const neckHeight = 20;
  const bodyHeight = 30;
  const maxWidth = 25;
  const minWidth = 15;

  const vertices = [
    // Neck
    {x: -minWidth/2, y: -neckHeight},
    {x: minWidth/2, y: -neckHeight},
    // Body
    {x: maxWidth/2, y: 0},
    {x: maxWidth/2, y: bodyHeight/2},
    {x: minWidth/2, y: bodyHeight},
    {x: -minWidth/2, y: bodyHeight},
    {x: -maxWidth/2, y: bodyHeight/2},
    {x: -maxWidth/2, y: 0}
  ];

  const vase = Matter.Bodies.fromVertices(x, y, vertices, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  Matter.Composite.add(world, vase);
}

export function spawnBarrel(x, y) {
  const height = 40;
  const width = 30;
  
  const vertices = [
    {x: -width/2, y: -height/2},
    {x: width/2, y: -height/2},
    {x: width/2 + 5, y: 0},
    {x: width/2, y: height/2},
    {x: -width/2, y: height/2},
    {x: -width/2 - 5, y: 0}
  ];

  const barrel = Matter.Bodies.fromVertices(x, y, vertices, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  Matter.Composite.add(world, barrel);
}

export function spawnCrate(x, y) {
  const size = 40;
  
  const crate = Matter.Bodies.rectangle(x, y, size, size, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  const woodGrain = Matter.Bodies.rectangle(x, y, size-10, size-10, {
    isSensor: true,
    render: {
      fillStyle: '#F8F8F8',
      strokeStyle: '#000000',
      lineWidth: 1
    }
  });

  const compositeCrate = Matter.Body.create({
    parts: [crate, woodGrain],
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  Matter.Composite.add(world, compositeCrate);
}

export function spawnWoodPlank(x, y) {
  const width = 80;
  const height = 20;
  
  const plank = Matter.Bodies.rectangle(x, y, width, height, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  const woodGrain = [];
  for(let i = 0; i < 3; i++) {
    woodGrain.push(Matter.Bodies.rectangle(x, y + (i*8 - 8), width-4, 2, {
      isSensor: true,
      render: {
        fillStyle: '#F8F8F8',
        strokeStyle: 'transparent'
      }
    }));
  }

  const compositePlank = Matter.Body.create({
    parts: [plank, ...woodGrain],
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  Matter.Composite.add(world, compositePlank);
}

export function spawnMetalSheet(x, y) {
  const width = 60;
  const height = 40;
  
  const sheet = Matter.Bodies.rectangle(x, y, width, height, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  // Add metallic shine details
  const shine = Matter.Bodies.rectangle(x - width/4, y - height/4, width/2, height/8, {
    isSensor: true,
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: 'transparent',
      opacity: 0.3
    }
  });

  const compositeSheet = Matter.Body.create({
    parts: [sheet, shine],
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  Matter.Composite.add(world, compositeSheet);
}

export function spawnConcreteBlock(x, y) {
  const size = 50;
  
  const vertices = [
    {x: -size/2, y: -size/2},
    {x: size/2, y: -size/2},
    {x: size/2, y: size/2},
    {x: -size/2, y: size/2}
  ];

  const block = Matter.Bodies.fromVertices(x, y, vertices, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  Matter.Composite.add(world, block);
}

export function spawnGear(x, y) {
  const radius = 25;
  const numTeeth = 12;
  const toothSize = 8;
  
  const vertices = [];
  for(let i = 0; i < numTeeth; i++) {
    const angle = (Math.PI * 2 / numTeeth) * i;
    vertices.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    });
    vertices.push({
      x: Math.cos(angle) * (radius + toothSize),
      y: Math.sin(angle) * (radius + toothSize)
    });
  }

  const gear = Matter.Bodies.fromVertices(x, y, vertices, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  Matter.Composite.add(world, gear);
}

export function spawnPiston(x, y) {
  const width = 20;
  const height = 60;
  
  const piston = Matter.Bodies.rectangle(x, y, width, height, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  const head = Matter.Bodies.rectangle(x, y - height/2, width*1.5, width, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  const compositePiston = Matter.Body.create({
    parts: [piston, head],
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  Matter.Composite.add(world, compositePiston);
}

export function spawnMotor(x, y) {
  const radius = 30;
  
  const motor = Matter.Bodies.circle(x, y, radius, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  const shaft = Matter.Bodies.rectangle(x, y, radius*0.2, radius*2, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 2
    }
  });

  const compositeMotor = Matter.Body.create({
    parts: [motor, shaft],
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  Matter.Composite.add(world, compositeMotor);
}

export function spawnBalloon(x, y) {
  const balloon = Matter.Bodies.circle(x, y, 20, {
    frictionAir: 0.001,
    restitution: 0.8,
    density: 0.0005,
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });

  Matter.Events.on(engine, 'beforeUpdate', function() {
    Matter.Body.applyForce(balloon, balloon.position, { x: 0, y: -0.001 });
  });
  
  Matter.Composite.add(world, balloon);
}

export function spawnBoulder(x, y) {
  const vertices = Matter.Vertices.fromPath('40 0 60 20 60 40 40 60 20 60 0 40 0 20 20 0');
  const boulder = Matter.Bodies.fromVertices(x, y, vertices, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  Matter.Composite.add(world, boulder);
}

export function spawnSpring(x, y) {
  const width = 40;
  const height = 60;
  
  const top = Matter.Bodies.rectangle(x, y - height/4, width, 10, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  
  const bottom = Matter.Bodies.rectangle(x, y + height/4, width, 10, {
    render: {
      fillStyle: '#FFFFFF',
      strokeStyle: '#000000',
      lineWidth: 3
    }
  });
  
  const constraint = Matter.Constraint.create({
    bodyA: top,
    bodyB: bottom,
    stiffness: 0.1,
    damping: 0.1,
    render: {
      type: 'line',
      strokeStyle: '#000000'
    }
  });
  
  Matter.Composite.add(world, [top, bottom, constraint]);
}