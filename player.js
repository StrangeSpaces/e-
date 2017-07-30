Player.prototype = Object.create(Entity.prototype);
Player.prototype.parent = Entity.prototype;

var LEFT = -1;
var RIGHT = 1;

var IDLE = 0;
var WALKING = 1;
var JUMP_SQUAT = 2;
var JUMPING = 3;
var JUMP_LAND = 4;
var AIR_DASH = 5;
var NORM_ATTK = 6;
var CROUCH = 7;
var CROUCH_ATTK = 8;

var walkableStates = [IDLE, WALKING, CROUCH];

function Player() {
    Entity.call(this, 'eneg', 80, 64);

    this.type = PLAYER;
    this.walkCycle = -100;
    this.dir = RIGHT;
    this.state = IDLE;

    this.pos.y = 250;
    this.halfWidth = 8;
    this.halfHeight = 15;

    this.offset.y = -17;

    this.energy = 1;

    this.addBox();
};

Player.prototype.hitGround = function() {
    this.vel.y = 0;
    this.collided = true;
    this.dashed = false;

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
        if (this.state != WALKING) {
            this.frameNumber = 4;
        } else {
            this.frameNumber++;
            if (this.frameNumber == 12) this.frameNumber = 4;
        }
    }
    this.state = WALKING;
}

Player.prototype.jump = function() {
    this.jumpPause = 8 + Math.ceil((1 - this.energy) * 24);;
    this.state = JUMP_SQUAT;
    this.frameNumber = 12;
}

Player.prototype.attack = function() {
    this.attkDur = -106;
    this.state = this.state == CROUCH ? CROUCH_ATTK : NORM_ATTK;
    this.frameNumber = this.state == CROUCH_ATTK ? 32 : 20;

    if (Key.isDown(Key.RIGHT)) {
        this.sprite.scale.x = 1;
        this.dir = RIGHT;
    } else if (Key.isDown(Key.LEFT)) {
        this.sprite.scale.x = -1;
        this.dir = LEFT;
    }
}

Player.prototype.energyLost = function() {
    this.energy -= 0.02;
    if (this.energy < 0) this.energy = 0;
}

Player.prototype.update = function() {
    if (walkableStates.includes(this.state)) {
        if (Key.isDown(Key.P)) {
            this.queueAttack = true;
        }
        if (Key.isDown(Key.UP)) {
            this.queueJump = true;
        }

        if (this.walkCycle < 0 && this.queueJump) {
            this.queueJump = false;
            this.jump();
            this.energyLost();
        } else if (this.walkCycle < 0 && this.queueAttack) {
            this.queueAttack = false;
            this.attack();
            this.energyLost();
        } else if (this.walkCycle <= -4 - (1 - this.energy) * 24 && Key.isDown(Key.DOWN)) {
            this.state = CROUCH;
            this.frameNumber = 28;
            this.walkCycle = -100;
        } else if (this.walkCycle <= -4 - (1 - this.energy) * 24) {
            if (Key.isDown(Key.RIGHT)) {
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
                this.state = IDLE;
            }
            this.energyLost();
        }
    } else if (this.state == JUMPING) {
        // if (!Key.isDown(Key.UP)) {
        //     this.canDash = true;
        // } else if (Key.isDown(Key.UP) && this.canDash && !this.dashed) {
        //     this.state = AIR_DASH;
        //     this.dashed = true;
        //     if (Key.isDown(Key.RIGHT)) {
        //         this.sprite.scale.x = 1;
        //         this.dir = RIGHT;
        //     } else if (Key.isDown(Key.LEFT)) {
        //         this.sprite.scale.x = -1;
        //         this.dir = LEFT;
        //     }

        //     this.vel.x = this.dir * 3;
        //     this.vel.y = 0;
        //     this.airDashDuration = 20;
        // }
    }

    if (this.state == JUMP_SQUAT) {
        this.jumpPause--;
        if (this.jumpPause == 0) {
            if (Key.isDown(Key.RIGHT)) {
                this.vel.x = 1.5;
            } else if (Key.isDown(Key.LEFT)) {
                this.vel.x = -1.5;
            } else {
                this.vel.x = 0;
            }

            this.state = JUMPING;
            this.canDash = false;
            this.vel.y = -6;
            this.frameNumber = 13;
        }
    } else if (walkableStates.includes(this.state)) {
        if (this.walkCycle > 0) {
            this.vel.x = 16/18 * this.dir;
            if (this.walkCycle == 9) {
                this.frameNumber++;
            }
            if (Key.isDown(Key.RIGHT)) {
            } else if (Key.isDown(Key.LEFT)) {
            } else {
                this.walkCycle = 0;
                if (this.frameNumber < 6) {
                    this.frameNumber = 6;
                } else {
                    this.frameNumber = 10;
                }
            }
        } else {
            if (this.walkCycle == 0) {
                this.frameNumber++;
            } else if (this.walkCycle == -4) {
                this.frameNumber++;
            }
        }
        this.walkCycle--;
        if (this.walkCycle <= 0) this.vel.x = 0;
    } else if (this.state == JUMPING) {
        this.jumpPause++;
        if (this.jumpPause % 9 == 0) this.frameNumber++;
        if (this.frameNumber > 17) this.frameNumber = 17;
    } else if (this.state == JUMP_LAND) {
        this.jumpPause++;
        if (this.jumpPause == 18) {
            this.frameNumber = 0;
            this.state = IDLE;
            this.walkCycle = -100;
        } else if (this.jumpPause == 9) {
            if (Key.isDown(Key.DOWN)) {
                this.state = CROUCH;
                this.frameNumber = 28;
                this.walkCycle = -100;
            } else {
                this.frameNumber++;
            }
        }
    } else if (this.state == AIR_DASH) {
        this.airDashDuration--;
        if (this.airDashDuration <= 0) {
            this.state = JUMPING;
        }
    } else if (this.state == NORM_ATTK) {
        this.attkDur++;

        if (this.attkDur == -100) {
            this.frameNumber++;
            this.attkDur = Math.ceil(-(1 - this.energy) * 24);
        }

        if (this.attkDur == 6) {
            this.addBox(new Box(this, 12 * this.dir, -6, 22 * this.dir, 4))
        } else if (this.attkDur == 18) {
            this.boxes.length = 1;
        }

        if (this.attkDur == 5 * 6) {
            this.state = IDLE;
            this.frameNumber = 0;
            this.walkCycle = -100;
        } else if (this.attkDur > 0 && this.attkDur % 6 == 0) {
            this.frameNumber++;
        }
    } else if (this.state == CROUCH_ATTK) {
        this.attkDur++;

        if (this.attkDur == -100) {
            this.frameNumber++;
            this.attkDur = Math.ceil(-(1 - this.energy) * 24);
        }

        if (this.attkDur == 6) {
            this.addBox(new Box(this, 12 * this.dir, 4, 22 * this.dir, 4))
        } else if (this.attkDur == 18) {
            this.boxes.length = 1;
        }

        if (this.attkDur == 5 * 6) {
            this.state = CROUCH;
            this.frameNumber = 28;
            this.walkCycle = -100;
        } else if (this.attkDur > 0 && this.attkDur % 6 == 0) {
            this.frameNumber++;
        }
    }

    if (this.state != AIR_DASH) this.vel.y += 0.25;

    this.collided = false;

    this.halfWidth = 8;
    Entity.prototype.update.call(this);
    if (this.attkDur >= 12 && this.attkDur < 24) this.halfWidth = 32;

    if (!this.collided && this.state != JUMPING && this.state != AIR_DASH) {
        this.state = JUMPING;
        this.jumpPause = 0;
        this.frameNumber = 15;
        this.canDash = false;
    }
};

Player.prototype.updateGraphics = function() {
    var dif = new Vec((-this.pos.x + logicalWidth/2) * scaleFactor - currentContainer.position.x,
                      (-this.pos.y + logicalHeight/2) * scaleFactor - currentContainer.position.y);
    dif.setLength(dif.length() / 16);

    currentContainer.position.x += dif.x;
    currentContainer.position.y += dif.y;

    Entity.prototype.updateGraphics.call(this);
}
