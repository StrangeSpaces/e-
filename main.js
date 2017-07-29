var logicalWidth = 320;
var logicalHeight = 240;

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

function resizeHandler() {
  var scaleFactor = Math.min(
    Math.floor(window.innerWidth / logicalWidth),
    Math.floor(window.innerHeight / logicalHeight)
  ) || 1;
  var newWidth = Math.ceil(logicalWidth * scaleFactor);
  var newHeight = Math.ceil(logicalHeight * scaleFactor);
  
  renderer.view.style.width = `${newWidth}px`;
  renderer.view.style.height = `${newHeight}px`;

  renderer.resize(newWidth, newHeight);
  mainContainer.scale.set(scaleFactor); 
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

    renderer.render(stage);

    // start the timer for the next animation loop
    requestAnimationFrame(animate);
};

function loadLevel() {
    currentContainer = mainContainer;

    Tilemap.init();
    entities.push(new Player());
    entities.push(new Enemy());
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
  stage.addChild(mainContainer);
  
  document.body.appendChild(renderer.view);
  window.addEventListener('resize', resizeHandler, false);
  resizeHandler();
  
  PIXI.loader.add('test', 'imgs/test.png').load(function (loader, res) {
      resources = res;

      window.focus();
      start();

      // kick off the animation loop (defined below)
      animate();
  });
};

init();
