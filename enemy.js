Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.parent = Entity.prototype;

var walkableStates = [IDLE, WALKING];

function Enemy() {
    Entity.call(this, 'test', 16, 16);

    this.type = ENEMY;
    this.walkCycle = 0;

    this.dir = RIGHT;

    this.state = IDLE;

    this.pos.y = 160;

    this.startX = this.pos.x;
    this.endX = this.pos.x + 100;
};

Enemy.prototype.hitGround = function() {
    this.vel.y = 0;

    if (this.state == JUMPING) {
        this.state = IDLE;
    }
}

Enemy.prototype.step = function() {
    if (this.walkCycle <= 0) {
        this.walkCycle = 16;
    }
}

Enemy.prototype.jump = function() {
    this.jumpPause = 10;
    this.state = JUMP_SQUAT;

    if (Key.isDown(Key.RIGHT)) {
        this.exitVelocity = 1;
    } else if (Key.isDown(Key.LEFT)) {
        this.exitVelocity = -1;
    } else {
        this.exitVelocity = 0;
    }
}

Enemy.prototype.update = function() {
    if (walkableStates.includes(this.state)) {
        if (this.walkCycle <= 0) {
            if (this.pos.x <= this.startX) {
                this.dir = RIGHT;
            } else if (this.pos.x >= this.endX) {
                this.dir = LEFT;
            }
            this.step();
        }
    }

    if (this.state == JUMP_SQUAT) {
        this.jumpPause--;
        if (this.jumpPause == 0) {
            this.state = JUMPING;
            this.vel.y = -8;
            this.vel.x = this.exitVelocity;
        }
    } else if (walkableStates.includes(this.state)) {
        if (this.walkCycle > 8) {
            this.vel.x = 1 * this.dir;
        } else {
            this.vel.x = 0;
        }
        this.walkCycle--;
    }

    this.vel.y += 0.5;

    Entity.prototype.update.call(this);
};

Enemy.prototype.updateGraphics = function() {
    Entity.prototype.updateGraphics.call(this);
}
