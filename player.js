Player.prototype = Object.create(Entity.prototype);
Player.prototype.parent = Entity.prototype;

var LEFT = -1;
var RIGHT = 1;

var IDLE = 0;
var WALKING = 1;
var JUMP_SQUAT = 2;
var JUMPING = 3;
var JUMP_LAND = 4;

var walkableStates = [IDLE, WALKING];

function Player() {
    Entity.call(this, 'eneg', 48, 48);

    this.type = PLAYER;
    this.walkCycle = -100;
    this.dir = RIGHT;
    this.state = IDLE;

    this.pos.y = 100;
    this.halfWidth = 8;

    this.energy = 1;
};

Player.prototype.hitGround = function() {
    this.vel.y = 0;

    if (this.state == JUMPING) {
        this.state = JUMP_LAND;
        this.jumpPause = 0;
        this.frameNumber = 18;
        this.vel.x = 0;
    }
}

Player.prototype.step = function() {
    if (this.walkCycle <= 0) {
        this.walkCycle = 18;
        if (this.frameNumber == 0) {
            this.frameNumber = 4;
        } else {
            this.frameNumber++;
            if (this.frameNumber == 12) this.frameNumber = 4;
        }
    }
}

Player.prototype.jump = function() {
    this.jumpPause = 10;
    this.state = JUMP_SQUAT;
    this.frameNumber = 12;

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
        if (this.walkCycle <= -8 - (1 - this.energy) * 24) {
            if (this.queueJump) {
                this.queueJump = false;
                this.jump();
            } else if (Key.isDown(Key.RIGHT)) {
                this.sprite.scale.x = 1;
                this.dir = RIGHT;
                this.step();
            } else if (Key.isDown(Key.LEFT)) {
                this.sprite.scale.x = -1;
                this.dir = LEFT;
                this.step();
            } else {
                this.energy += 0.02;
                this.frameNumber = 0;
            }
            this.energy -= 0.02;
            if (this.energy < 0) this.energy = 0;
        }
    }

    if (this.state == JUMP_SQUAT) {
        this.jumpPause--;
        if (this.jumpPause == 0) {
            this.state = JUMPING;
            this.vel.y = -5;
            this.vel.x = this.exitVelocity;
            this.frameNumber = 13;
        }
    } else if (walkableStates.includes(this.state)) {
        if (this.walkCycle > 0) {
            this.vel.x = (0.75) * this.dir;
            if (this.walkCycle == 9) {
                this.frameNumber++;
            }
        } else {
            this.vel.x = 0;
            if (this.walkCycle == 0) {
                this.frameNumber++;
            } else if (this.walkCycle == -4) {
                this.frameNumber++;
            }
        }
        this.walkCycle--;
    } else if (this.state == JUMPING) {
        this.jumpPause++;
        if (this.jumpPause % 9 == 0) this.frameNumber++;
    } else if (this.state == JUMP_LAND) {
        this.jumpPause++;
        if (this.jumpPause == 18) {
            this.frameNumber = 0;
            this.state = IDLE;
        } else if (this.jumpPause % 9 == 0) {
            this.frameNumber++;
        }
    }

    this.vel.y += 0.25;

    Entity.prototype.update.call(this);
};

Player.prototype.updateGraphics = function() {
    Entity.prototype.updateGraphics.call(this);
}
