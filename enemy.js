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
    this.halfHeight = 8;
    this.halfWidth = 8;

    Enemy.call(this, 'test', 16, 16);

    this.vel.x = 0;
};


Chucker.prototype.update = function() {
    this.vel.y += 0.1;

    this.f++;
    if (this.f % 9 == 0) {
        this.frameNumber = (this.frameNumber + 1) % 4;
    }

    if (this.f % 90 == 0) {
        this.shoot();
    }

    Entity.prototype.update.call(this);
}

Chucker.prototype.shoot = function() {
    var saw = new Saw();

    saw.pos.x = this.pos.x;
    saw.pos.y = this.pos.y;

    saw.vel.x = -3;
    saw.arc = false;

    entities.push(saw);
}

Chucker.prototype.updateGraphics = function() {
    Entity.prototype.updateGraphics.call(this);
}

Chucker.prototype.hitWall = function() {
}

Saw.prototype = Object.create(Entity.prototype);
Saw.prototype.parent = Entity.prototype;

function Saw() {
    Entity.call(this, 'energy', 16, 16);

    this.addBox();
    this.f = 0;

    this.pos.x = 100
    this.type = SAW;
    this.arc = true;
}

Saw.prototype.hitWall = function() {
    this.dead = true
}

Saw.prototype.hitGround = function() {
    this.dead = true
}

Saw.prototype.update = function() {
    this.f++;
    if (this.f % 6 == 0) {
        this.frameNumber = (this.frameNumber + 1) % 8;
    }

    if (this.arc) this.vel.y += 0.1;

    Entity.prototype.update.call(this);
}

