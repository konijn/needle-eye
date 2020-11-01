//jshint esversion:6
// Install plugin
Matter.use('matter-attractors');// PLUGIN_NAME
Matter.use('matter-collision-events');// PLUGIN_NAME

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

function UI() {
  listenToResize();

  // Create engine
  this.engine = Engine.create();

  // Create renderer
  this.render = Render.create({
    element: document.body,
    engine: this.engine,
    options: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      wireframes: false,
      background: 'black',
      showIds: true
    }
  });

  //Link engine and renderer
  this.engine.render = this.render;

  // Create runner
  this.runner = Runner.create();
  // Do the running
  Runner.run(this.runner, this.engine);
  Render.run(this.render);

  // Create demo scene
  this.world = this.engine.world;
  this.world.gravity.scale = 0;

  // add a mouse controlled constraint
  this.mouseConstraint = MouseConstraint.create(this.engine, {
    constraint: {
      render: {
        visible: false
      }
    }
  });

  World.add(this.world, this.mouseConstraint);

  World.add(this.world, UI.createPortal(this));

  Events.on(this.mouseConstraint, 'mousedown', passBodyToGame);

  function passBodyToGame(e) {
    if (ui.mouseConstraint.body) {
      game.onClick(ui.mouseConstraint.body);
    }
  }

}

function listenToResize() {

  function captureSize() {
    console.log("Resize captured!");
    UI.height = window.innerHeight || document.documentElement.clientHeight;
    UI.width = window.innerWidth || document.documentElement.clientWidth;
    UI.centerX = UI.width >> 1;
    UI.centerY = UI.height >> 1;
  }

  window.addEventListener("optimizedResize", captureSize);

  captureSize();
}

UI.createPortal = function createPortalUI(ui) {

  // create a body with an attractor
  return Bodies.circle(ui.render.options.width / 2, ui.render.options.height / 2, 50, {
    isStatic: true,
    label: 'centerPortal',
    id:'centerPortal',
    render: {
      sprite: {
        texture: 'png/star-gate.png',
        xScale: 0.1,
        yScale: 0.1,
        showId: true
      }
    },

    // example of an attractor function that
    // returns a force vector that applies to bodyB
    //Todo recognize non attracted thingies
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
};

UI.createImp = function createImp(ui) {

  spot = UI.rollBorderLocation(ui);

  var imp = Bodies.circle(spot.x, spot.y, 32, {
    label: 'Imp,' + guid(),
    render: {
      sprite: {
        texture: './png/imp.png',
        xScale: 0.1,
        yScale: 0.1
      }
    },
  });

  imp.onCollide(function(pair) {
    console.log('Imp got hit!', pair);
  });

  World.add(ui.world, imp);
  return imp;
};

UI.createLog = function createLog(ui) {

  spot = UI.rollBorderLocation(ui);

  var log = Bodies.circle(spot.x, spot.y, 32, {
    label: 'Log,' + guid(),
    render: {
      sprite: {
        texture: './png/log.png',
        xScale: 0.1,
        yScale: 0.1
      }
    },
  });

  World.add(ui.world, log);
  return log;
};

UI.rollBorderLocation = function rollBorderLocation(ui) {

  let border = Common.choose([1, 2, 3, 4]),
      x = Common.random(0, ui.render.options.width),
      y = Common.random(0, ui.render.options.height);

  if (border == 1)
    return {
      x: 0,
      y: y
    };
  if (border == 2)
    return {
      x: ui.render.options.width,
      y: y
    };
  if (border == 3)
    return {
      x: x,
      y: 0
    };
  if (border == 4)
    return {
      x: x,
      y: ui.render.options.height
    };
};

UI.log = function(txt, x, y) {
  let div = document.createElement("div");
  let content = document.createTextNode(txt);
  div.classList.add('message');
  div.appendChild(content);
  document.body.appendChild(div);
  UI.animateLog();
};

UI.animateLog = function animateLog() {
  if (UI.interval)
    return;

  UI.interval = window.setInterval(UI.animateLogItems, 100);
};

UI.animateLogItems = function animateLogItems() {
  let list = document.getElementsByClassName('message');
  for (const e of list) {
    //console.log(e);
    if (e.offsetTop < 5) {
      document.body.removeChild(e);
    } else {
      e.style.top = (e.offsetTop - 1) + 'px';
    }
  }
};

UI.remove = function(body){
  World.remove(ui.world, body);
};
