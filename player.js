Player.prototype = Object.create(Entity.prototype);
Player.prototype.parent = Entity.prototype;

var LEFT = -1;
var RIGHT = 1;

var IDLE = 0;
var WALKING = 1;
var JUMP_SQUAT = 2;
var JUMPING = 3;

var walkableStates = [IDLE, WALKING];

function Player() {
    Entity.call(this, 'test', 16, 16);

    this.type = PLAYER;
    this.walkCycle = 0;

    this.dir = RIGHT;

    this.state = IDLE;

    this.pos.y = 160;
};

Player.prototype.step = function() {
    if (this.walkCycle <= 0) {
        this.walkCycle = 20;
    }
}

Player.prototype.jump = function() {
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

Player.prototype.update = function() {
    if (walkableStates.includes(this.state)) {
        if (Key.isDown(Key.UP)) {
            this.queueJump = true;
        }
        if (this.walkCycle <= 0) {
            if (this.queueJump) {
                this.queueJump = false;
                this.jump();
            } else if (Key.isDown(Key.RIGHT)) {
                this.dir = RIGHT;
                this.step();
            } else if (Key.isDown(Key.LEFT)) {
                this.dir = LEFT;
                this.step();
            }
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
        if (this.walkCycle > 10) {
            this.vel.x = 1 * this.dir;
        } else {
            this.vel.x = 0;
        }
        this.walkCycle--;
    }

    this.vel.y += 0.5;

    Entity.prototype.update.call(this);

    if (this.pos.y >= 160) {
        this.vel.y = 0;
        this.pos.y = 160;

        if (this.state == JUMPING) {
            this.state = IDLE;
        }
    }
};

Player.prototype.updateGraphics = function() {


    Entity.prototype.updateGraphics.call(this);
}
