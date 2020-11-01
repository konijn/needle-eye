// install plugin
Matter.use('matter-attractors');// PLUGIN_NAME
Matter.use('matter-collision-events');

// module aliases
var Engine = Matter.Engine,
    Events = Matter.Events,
    Runner = Matter.Runner,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Mouse = Matter.Mouse,
    Common = Matter.Common,
    Bodies = Matter.Bodies,
    MouseConstraint = Matter.MouseConstraint;

// create engine
var engine = Engine.create();

// create renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    wireframes: false,
    background: 'black'
  }
});

// create runner
var runner = Runner.create();

Runner.run(runner, engine);
Render.run(render);

// create demo scene
var world = engine.world;
world.gravity.scale = 0;

// add a mouse controlled constraint
var mouseConstraint = MouseConstraint.create(engine, {
  render: {
    visible: false
  }
});
World.add(engine.world, mouseConstraint);

// create a body with an attractor
var attractiveBody = Bodies.circle(render.options.width / 2, render.options.height / 2, 50, {
  isStatic: true,
  render: {
    sprite: {
      texture: 'png/star-gate.png',
      xScale: 0.1,
      yScale: 0.1
    }
  },

  // example of an attractor function that
  // returns a force vector that applies to bodyB
  plugin: {
    attractors: [// MatterAttractors.Attractors.gravity(bodyA, bodyB)
    function(bodyA, bodyB) {
      return {
        x: (bodyA.position.x - bodyB.position.x) * 1e-6,
        y: (bodyA.position.y - bodyB.position.y) * 1e-6,
      };
    }
    ]
  }
});

World.add(world, attractiveBody);

// add some bodies that to be attracted
for (var i = 0; i < 150; i += 1) {
  var body = Bodies.circle(Common.random(0, render.options.width), Common.random(0, render.options.height), 32, {
    render: {
      sprite: {
        texture: '/png/imp.png',
        xScale: 0.1,
        yScale: 0.1
      }
    },
  });

  World.add(world, body);
}

// add mouse control
/*
var mouse = Mouse.create(render.canvas);

Events.on(engine, 'afterUpdate', function() {
    if (!mouse.position.x) {
      return;
    }

    // smoothly move the attractor body towards the mouse
    Body.translate(attractiveBody, {
        x: (mouse.position.x - attractiveBody.position.x) * 0.25,
        y: (mouse.position.y - attractiveBody.position.y) * 0.25
    });
});
*/

Events.on(mouseConstraint, 'mousedown', doStuff);

Matter.Body.onCollide(function collided(pair){
  console.log('collision', pair);
});

/*Events.onCollide(function(pair) {
    console.log('BoxB got hit!', pair);
		pair.bodyA.render.fillStyle = colors[Math.floor(Math.random() * colors.length)];
		pair.bodyB.render.fillStyle = colors[Math.floor(Math.random() * colors.length)];
  });*/

function doStuff(e) {

  e.source.constraint.render.visible = false;
  if (mouseConstraint.body) {
    console.log(mouseConstraint.body);
  }
}
