Energy.prototype = Object.create(Entity.prototype);
Energy.prototype.parent = Entity.prototype;

function Energy() {
    Entity.call(this, 'energy', 16, 16);

    this.addBox();
    this.f = 0;
    this.frameNumber = Math.floor(random(0, 8));

    this.pos.x = 100

    this.type = ENERGY;
}

Energy.prototype.update = function() {
    this.friction(0.05);

    this.f++;
    if (this.f % 6 == 0) {
        this.frameNumber = (this.frameNumber + 1) % 8;
    }

    this.vel.y += 0.1;

    Entity.prototype.update.call(this);
}


Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.parent = Entity.prototype;

function Enemy(file, x, y) {
    Entity.call(this, file || 'rust', x || 32, y || 32);

    this.type = ENEMY;
    this.dir = RIGHT;
    this.vel.x = 0.5;

    this.f = 0;

    this.pos.y = 160;
    this.pos.x = 100;

    if (!this.halfWidth) {
        this.halfHeight = 8;
        this.halfWidth = 9;
        this.offset.y = -8;
    }

    this.addBox();
};

Enemy.prototype.update = function() {
    this.f++;
    if (this.f % 9 == 0) {
        this.frameNumber = (this.frameNumber + 1) % 4;
    }

    if (Tilemap.getTile(Math.floor(this.pos.x / 16), Math.floor(this.pos.y / 16 + 1)) == 0) {
        this.vel.x *= -1;
        this.dir *= -1;
    }

    this.vel.y += 0.5;

    this.sprite.scale.x = -this.dir;
    Entity.prototype.update.call(this);
};

Enemy.prototype.hitWall = function() {
    this.vel.x *= -1;
    this.dir *= -1;
}

Bouncer.prototype = Object.create(Enemy.prototype);
Bouncer.prototype.parent = Enemy.prototype;

function Bouncer() {
    Entity.call(this, 'test', 16, 16);

    this.type = ENEMY;
    this.walkCycle = 0;

    this.dir = RIGHT;

    this.state = IDLE;

    this.pos.y = 160;

    this.startX = this.pos.x;
    this.vel.x = 0.5;
    this.endX = this.pos.x + 100;

    this.addBox();
};

Bouncer.prototype.hitGround = function() {
    this.vel.y = -2.5;
    if (this.pos.x <= this.startX) {
        this.vel.x = 0.5;
    } else if (this.pos.x >= this.endX) {
        this.vel.x = -0.5;
    }
}


Bouncer.prototype.update = function() {
    this.vel.y += 0.1;


    Entity.prototype.update.call(this);
}

Bouncer.prototype.updateGraphics = function() {
    Entity.prototype.updateGraphics.call(this);
}


Chucker.prototype = Object.create(Enemy.prototype);
Chucker.prototype.parent = Enemy.prototype;

function Chucker() {
    this.halfWidth = 16;
    this.halfHeight = 8;

    Enemy.call(this, 'saw', 32, 32);

    console.log(this.type);

    this.vel.x = 0;
    this.offset.y = -8;

    this.fn = 0;
};


Chucker.prototype.update = function() {
    this.vel.y += 0.5

    if (player.pos.x > this.pos.x) {
        this.dir = 1;
    } else {
        this.dir = -1;
    }

    this.f++;
    if (this.f % 120 == 0) {
        this.shoot();
    } else if (this.f % 120 < 12) {
        this.fn = 1;
    } else if (this.f % 120 > 96) {
        this.fn = 1;
    } else if (this.f % 120 > 108) {
        this.fn = 0;
    } else {
        this.fn = 2;
    }

    Entity.prototype.update.call(this);
}

Chucker.prototype.shoot = function() {
    var saw = new Saw();

    if (Math.abs(player.pos.y - this.pos.y) > 30) {
        saw.vel.x = 1;
        saw.vel.y = -2.5;

        saw.pos.x = this.pos.x + 2 * this.dir;
        saw.pos.y = this.pos.y + -4;
    } else {
        saw.vel.x = 2;
        saw.vel.y = 0;
        saw.arc = false;

        saw.pos.x = this.pos.x + 4 * this.dir;
        saw.pos.y = this.pos.y + -2;
    }
    saw.vel.x *= this.dir;

    saw.pos.x += saw.vel.x;
    saw.pos.y += saw.vel.y;

    entities.push(saw);

    this.fn = 1;
}

Chucker.prototype.updateGraphics = function() {
    if (Math.abs(player.pos.y - this.pos.y) > 30) {
        this.frameNumber = this.fn + 4;
    } else {
        this.frameNumber = this.fn;
    }

    this.sprite.scale.x = -this.dir;

    Entity.prototype.updateGraphics.call(this);
}

Chucker.prototype.hitWall = function() {
}

Saw.prototype = Object.create(Entity.prototype);
Saw.prototype.parent = Entity.prototype;

function Saw() {
    this.halfWidth = 8;
    this.halfHeight = 8;
    Entity.call(this, 'saw', 32, 32);

    this.addBox();
    this.frameNumber = 7;

    this.pos.x = 100
    this.type = SAW;
    this.arc = true;

    this.moveThroughWalls = true;
}

// Saw.prototype.hitWall = function() {
//     this.dead = true
// }

// Saw.prototype.hitGround = function() {
//     this.dead = true
// }

Saw.prototype.update = function() {
    if (this.arc) this.vel.y += 0.05;

    Entity.prototype.update.call(this);

    if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > tileMapWidth * 16 || this.pos.y > tileMapHeight * 16) this.dead = true;
}

