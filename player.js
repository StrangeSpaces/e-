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
var AIR_ATK = 9;

var walkableStates = [IDLE, WALKING, CROUCH];

var filter = new PIXI.filters.ColorMatrixFilter();
filter.matrix = [ 
    1, 0, 0, 256,
    1, 1, 0, 256,
    0, 0, 1, 256,
    0, 0, 0, 1
];

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

    this.lastY = this.pos.y;

    this.energy = 1;
    this.hp = 3;

    this.damaged = 0;

    this.halfWidth = 5;
    this.addBox();

    this.f = 0;
};

Player.prototype.right = function() {
    return this.dir == RIGHT ? this.pos.x + 10 : this.pos.x + 8;
}

Player.prototype.left = function() {
    return this.dir == LEFT ? this.pos.x - 10 : this.pos.x - 8;
}

Player.prototype.hitGround = function() {
    this.vel.y = 0;
    this.collided = true;
    this.dashed = false;

    if (this.state == JUMPING) {
        this.state = JUMP_LAND;
        this.jumpPause = 0;
        this.frameNumber = 18;
        this.vel.x = 0;
        this.boxes.length = 1;

        landClang.play();
    } else if (this.state == AIR_ATK) {
        landClang.play();
        this.boxes.length = 1;

        if (Key.isDown(Key.DOWN)) {
            this.state = CROUCH_ATTK;

            if (this.attkDur <= 6 && this.attkDur < 18) {
                this.addBox(new Box(this, 12 * this.dir, 5, 22 * this.dir, 2));
            }

            this.frameNumber -= 8;
        } else {
            this.state = NORM_ATTK;

            if (this.attkDur <= 6 && this.attkDur < 18) {
                this.addBox(new Box(this, 12 * this.dir, -5, 22 * this.dir, 2));
            }

            this.frameNumber -= 20;
        }

        this.jumpPause = 0;
        this.vel.x = 0;
    }
}

Player.prototype.step = function() {
    if (this.walkCycle <= 0) {
        this.walkCycle = 18;
        if (this.state != WALKING || this.frameNumber >= 11) {
            this.frameNumber = 4;
        } else {
            this.frameNumber = 8;
        }
        this.state = WALKING;
    }
}

Player.prototype.jump = function() {
    this.jumpPause = 6 + Math.ceil((1 - this.energy) * 24);
    this.state = JUMP_SQUAT;
    this.frameNumber = 12;
    this.vel.x = 0;
}

Player.prototype.damage = function() {
    if (this.damaged <= 0) {
        this.hp--;
        this.damaged = 60;

        getHit.play();

        if (this.hp <= 0) {
            start();
        }
    }
}

Player.prototype.attack = function() {
    this.attkDur = -106;

    if (this.state == CROUCH) {
        this.state = CROUCH_ATTK;
        this.frameNumber = 32;
    } else if (this.state == JUMPING) {
        this.state = AIR_ATK;
        this.frameNumber = 40;
    } else {
        this.state = NORM_ATTK;
        this.frameNumber = 20;
    }

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

Player.prototype.input = function() {
    if (walkableStates.includes(this.state)) {
        if (Key.isDown(Key.P)) {
            this.queueAttack = true;
        }
        if (Key.isDown(Key.UP)) {
            this.queueJump = true;
        }

        if (this.queueJump) {
            this.queueJump = false;
            this.jump();
            this.energyLost();
            return
        }

        if (this.walkCycle < 0) {
            var done = false;
            if (Key.isDown(Key.DOWN)) {
                this.state = CROUCH;
                this.frameNumber = 28;
                done = true;
            } else {
                if (this.state == CROUCH) {
                    this.frameNumber = 0;
                    this.state = IDLE;
                }
            }
            if (this.queueAttack) {
                this.queueAttack = false;
                this.attack();
                this.energyLost();
                return
            }
            if (done) return
        }

        if (this.walkCycle <= -4 - (1 - this.energy) * 24) {
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
        if (Key.isDown(Key.P)) {
            this.attack();
            this.energyLost();
        }
    }

    if (this.state == JUMPING || this.state == AIR_ATK) {
        this.friction(0.05);
        if (Key.isDown(Key.RIGHT)) {
            this.vel.x += 0.1;
            if (this.vel.x > 1.5) this.vel.x = 1.5;
        } else if (Key.isDown(Key.LEFT)) {
            this.vel.x -= 0.1;
            if (this.vel.x < -1.5) this.vel.x = -1.5;
        }
    }
}

Player.prototype.update = function() {
    this.input();

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

            crouchUncrouch.play();

            this.state = JUMPING;
            this.vel.y = Key.isDown(Key.UP) ? -6 : -4;
            this.frameNumber = 13;
        }
    } else if (this.state == WALKING) {
        if (this.walkCycle > 0) {
            this.vel.x = 16/18 * this.dir;
            if (this.walkCycle == 9) {
                this.frameNumber++;
            }

            var l = Key.isDown(Key.LEFT);
            var r = Key.isDown(Key.RIGHT);
            if ((!l && !r) || (!l && this.dir == LEFT) || (!r && this.dir == RIGHT)) {
                this.walkCycle = 0;
                stomp.play();
                if (this.frameNumber < 6) {
                    this.frameNumber = 6;
                } else {
                    this.frameNumber = 10;
                }
            }
        } else {
            if (this.walkCycle == 0) {
                this.frameNumber++;
                stomp.play();
                var spark = new Spark();
                spark.pos.x = this.pos.x + 8 * this.dir;
                spark.pos.y = this.pos.y - 2;
                entities.push(spark);
            } else if (this.walkCycle == -4) {
                this.frameNumber++;
            }
        }
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
    } else if (this.state == NORM_ATTK) {
        this.attkDur++;

        if (this.attkDur == -100) {
            this.frameNumber++;
            this.attkDur = Math.ceil(-(1 - this.energy) * 24);
        }

        if (this.attkDur == 6) {
            this.addBox(new Box(this, 12 * this.dir, -5, 22 * this.dir, 2));
            whiff.play();
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
            this.addBox(new Box(this, 12 * this.dir, 5, 22 * this.dir, 2))
            whiff.play();
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
    } else if (this.state == AIR_ATK) {
        this.attkDur++;

        if (this.attkDur == -100) {
            this.frameNumber++;
            this.attkDur = Math.ceil(-(1 - this.energy) * 24);
        }

        if (this.attkDur == 6) {
            this.addBox(new Box(this, 12 * this.dir, -5, 22 * this.dir, 2))
            whiff.play();
        } else if (this.attkDur == 18) {
            this.boxes.length = 1;
        }

        if (this.attkDur == 5 * 6) {
            this.state = JUMPING;
            this.frameNumber = 15;
        } else if (this.attkDur > 0 && this.attkDur % 6 == 0) {
            this.frameNumber++;
        }
    }
    this.walkCycle--;
    this.damaged--;
    this.f++;

    if (this.hp < 3 && this.f % (this.hp * 60) == 0) {
        var smoke = new Smoke();
        smoke.pos.x = this.pos.x;
        smoke.pos.y = this.pos.y - 10;
        entities.push(smoke);
    }

    if (this.damaged > 0 && Math.floor(this.damaged / 8) % 2 == 1) {
        this.sprite.filters = [filter];
    } else {
        this.sprite.filters = [];
    }

    theme.rate(this.energy / 10 + 0.9);

    this.vel.y += 0.25;

    this.collided = false;

    Entity.prototype.update.call(this);

    if (!this.collided && this.state != JUMPING && this.state != AIR_ATK) {
        this.state = JUMPING;
        this.queueJump = false;
        this.jumpPause = 0;
        this.frameNumber = 15;
    }
};

Player.prototype.updateGraphics = function() {
    if (this.state != JUMPING && this.state != AIR_ATK) {
        this.lastY = this.pos.y;
    } else if (this.pos.y - this.lastY > 20) {
        this.lastY += (this.pos.y - this.lastY) - 20;
    }

    var dif = new Vec((-this.pos.x + logicalWidth/2) * scaleFactor - currentContainer.position.x,
                      (-this.lastY + 32 + logicalHeight/2) * scaleFactor - currentContainer.position.y);
    dif.setLength(dif.length() / 16);

    currentContainer.position.x += dif.x;
    currentContainer.position.y += dif.y;

    if (currentContainer.position.x > 0) {
        currentContainer.position.x = 0; 
    } 
    if (currentContainer.position.x < (tileMapWidth * 16 - logicalWidth) * -scaleFactor){
        currentContainer.position.x = (tileMapWidth * 16 - logicalWidth) * -scaleFactor;
    }
    if (currentContainer.position.y > 0) {
        currentContainer.position.y = 0; 
    } 
    if (currentContainer.position.y < (tileMapHeight * 16 - logicalHeight) * -scaleFactor){
        currentContainer.position.y = (tileMapHeight * 16 - logicalHeight) * -scaleFactor;
    }

    frontContainer.position.x = currentContainer.position.x;
    frontContainer.position.y = currentContainer.position.y;

    power.texture.frame = new PIXI.Rectangle(0, 32, 7 + Math.ceil(this.energy * 10) * 4, 32);
    heart.texture.frame = new PIXI.Rectangle(0, 64, 14 + this.hp * 11, 32);

    Entity.prototype.updateGraphics.call(this);
}
