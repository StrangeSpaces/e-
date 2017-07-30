var logicalWidth = 320;
var logicalHeight = 200;

var leftVel = -0.5;
var rightVel = 0.5;

var leftEnts = [];
var rightEnts = [];

var renderer = null;
var stage = null;
var mainContainer = null;

var resources = null;

var entities = [];

var currentLevel = 0;
var scaleFactor;
var player;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function resizeHandler() {
  scaleFactor = Math.min(
    Math.floor(window.innerWidth / logicalWidth),
    Math.floor(window.innerHeight / logicalHeight)
  ) || 1;
  var newWidth = Math.ceil(logicalWidth * scaleFactor);
  var newHeight = Math.ceil(logicalHeight * scaleFactor);
  
  renderer.view.style.width = `${newWidth}px`;
  renderer.view.style.height = `${newHeight}px`;

  renderer.resize(newWidth, newHeight);
  mainContainer.scale.set(scaleFactor); 
  uiContainer.scale.set(scaleFactor);
};

function quadCollision() {
    var qt = new Quadtree();
    for (var i = entities.length - 1; i >= 0; i--) {
        qt.add(entities[i]);
    }
    qt.run();
}

function collision() {
    var length = this.entities.length;

    if (length == 0) return;

    for (var i = 0; i < length - 1; i++) {
        var entI = this.entities[i];

        for (var t = i + 1; t < length; t++) {
            CollisionHandler.handle(entI, this.entities[t]);
        }
    }
}

function animate() {
    for (var i = entities.length - 1; i >= 0; i--) {
        entities[i].update();
    }

    collision();

    entities = entities.filter(function( obj ) {
        if (obj.dead) {
            currentContainer.removeChild(obj.sprite);
        }
        return !obj.dead;
    });

    renderer.render(stage);

    // start the timer for the next animation loop
    requestAnimationFrame(animate);
};

function loadLevel() {
    currentContainer = mainContainer;

    Tilemap.init();

    player = new Player();
    entities.push(player);

    border = new PIXI.Sprite(new PIXI.Texture(resources['ui'].texture, new PIXI.Rectangle(0, 0, 48, 32)));
    uiContainer.addChild(border);

    power = new PIXI.Sprite(new PIXI.Texture(resources['ui'].texture, new PIXI.Rectangle(0, 32, 48, 32)));
    uiContainer.addChild(power);

    heart = new PIXI.Sprite(new PIXI.Texture(resources['ui'].texture, new PIXI.Rectangle(0, 64, 48, 32)));
    uiContainer.addChild(heart);
}

function start() {
    mainContainer.removeChildren();

    loadLevel();
};

function init() {
  renderer = PIXI.autoDetectRenderer(logicalWidth, logicalHeight, {
    roundPixels: true,
    resolution: window.devicePixelRatio || 1,
    backgroundColor: 0x350902,
  });
  renderer.view.id = 'pixi-canvas';
  
  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
  
  stage = new PIXI.Container();
  mainContainer = new PIXI.Container();
  uiContainer = new PIXI.Container();
  stage.addChild(mainContainer);
  stage.addChild(uiContainer);
  
  document.body.appendChild(renderer.view);
  window.addEventListener('resize', resizeHandler, false);
  resizeHandler();
  
  PIXI.loader.add('test', 'imgs/test.png')
             .add('saw', 'imgs/saw.png')
             .add('tiles', 'imgs/tiles.png')
             .add('energy', 'imgs/energy.png')
             .add('rust', 'imgs/rust.png')
             .add('ui', 'imgs/ui.png')
             .add('eneg', 'imgs/eneg.png')
             .add('ealpha', 'imgs/ealpha.png').load(function (loader, res) {
      resources = res;

      window.focus();
      start();

      // kick off the animation loop (defined below)
      animate();
  });
};

init();
