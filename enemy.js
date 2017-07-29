Energy.prototype = Object.create(Entity.prototype);
Energy.prototype.parent = Energy.prototype;

function Energy() {
    Entity.call(this, 'energy', 16, 16);

    this.addBox();
    this.f = 0;

    this.pos.x = 100

    this.type = ENERGY;
}

Energy.prototype.update = function() {
    this.f++;
    if (this.f % 6 == 0) {
        this.frameNumber = (this.frameNumber + 1) % 8;
    }

    this.vel.y += 0.1;

    Entity.prototype.update.call(this);
}


Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.parent = Entity.prototype;

function Enemy() {
    Entity.call(this, 'rust', 32, 32);

    this.type = ENEMY;
    this.walkCycle = 0;

    this.dir = RIGHT;

    this.state = IDLE;
    this.f = 0;

    this.pos.y = 160;
    this.pos.x = 100;

    this.startX = this.pos.x;
    this.endX = this.pos.x + 100;

    this.halfHeight = 8;
    this.halfWidth = 9;
    this.offset.y = -8;

    this.addBox();
};

Enemy.prototype.update = function() {
    this.f++;
    if (this.f % 9 == 0) {
        this.frameNumber = (this.frameNumber + 1) % 4;
    }

    if (this.pos.x <= this.startX) {
        this.vel.x = 0.5;
        this.dir = RIGHT;
    } else if (this.pos.x >= this.endX) {
        this.vel.x = -0.5;
        this.dir = LEFT;
    }

    this.vel.y += 0.5;

    this.sprite.scale.x = -this.dir;
    Entity.prototype.update.call(this);
};


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

