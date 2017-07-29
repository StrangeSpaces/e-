function Vec(x,y) {
    this.x = x;
    this.y = y;
}

Vec.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vec.prototype.setLength = function(target) {
    if (target <= 0) {
        this.x = 0;
        this.y = 0;
        return;
    }

    var len = this.length();
    if (len == 0) {
        this.x = target;
    } else {
        this.x *= (target/len);
        this.y *= (target/len);
    }
}

var ENTITY = 0;
var PLAYER = 1;
var ENEMY = 2;

var runningID = 0;


function Box(entity, x, y, width, height) {
    this.ent = entity;

    if (width < 0) {
        x = x + width;
        width = -width;
    }

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Box.prototype.collide = function(other) {
    return (this.ent.pos.x + this.x < other.ent.pos.x + other.x + other.width &&
            this.ent.pos.y + this.y < other.ent.pos.y + other.y + other.height &&
            this.ent.pos.x + this.x + this.width > other.ent.pos.x + other.x  &&
            this.ent.pos.y + this.y + this.height > other.ent.pos.y + other.y)
}

function Entity(file, width, height) {
    this.pos = new Vec(15, 15);
    this.vel = new Vec(0, 0);
    this.offset = new Vec(0, 0);

    this.boxes = [];
    this.height = 0;

    this.id = ++runningID;

    if (file) {
        this.frameNumber = 0;
        this.framesPerRow = Math.floor(resources[file].texture.width / width);

        this.frame = new PIXI.Rectangle(0, 0, width, height);
        this.sprite = new PIXI.Sprite(new PIXI.Texture(resources[file].texture, this.frame));

        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        currentContainer.addChild(this.sprite);
        this.con = currentContainer;
    }

    this.halfWidth = width / 2;
    this.halfHeight = height / 2;
}

Entity.prototype.addBox = function(box) {
    if (!box) {
        box = new Box(this, -this.halfWidth, -this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
    }
    this.boxes.push(box);
}

Entity.prototype.top = function() {
    return this.pos.y - this.halfHeight;
}

Entity.prototype.bot = function() {
    return this.pos.y + this.halfHeight;
}

Entity.prototype.left = function() {
    return this.pos.x - this.halfWidth;
}

Entity.prototype.right = function() {
    return this.pos.x + this.halfWidth;
}

Entity.prototype.collide = function(other) {
    for (var i = this.boxes.length - 1; i >= 0; i--) {
        for (var t = other.boxes.length - 1; t >= 0; t--) {
            if (this.boxes[i].collide(other.boxes[t])) {
                return [i, t];
            }
        }
    }

    return null;
}

Entity.prototype.updateGraphics = function() {
    this.sprite.position.x = this.pos.x + this.offset.x;
    this.sprite.position.y = this.pos.y + this.offset.y;

    this.frame.x = (this.frameNumber % this.framesPerRow) * this.frame.width;
    this.frame.y = Math.floor(this.frameNumber / this.framesPerRow) * this.frame.height;

    this.sprite.texture.frame = this.frame;
}

Entity.prototype.update = function() {
    this.pos.x += this.vel.x;
    Tilemap.check(this, 0);
    this.pos.y += this.vel.y;
    Tilemap.check(this, 1);

    this.updateGraphics();
};
