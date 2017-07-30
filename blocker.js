Blocker.prototype = Object.create(Enemy.prototype);
Blocker.prototype.parent = Enemy.prototype;

function Blocker() {
    this.halfWidth = 8;
    this.halfHeight = 15;

    Enemy.call(this, 'ealpha', 80, 64);
    this.addBox(new Box(this, 9, -7, 2, 11));

    this.type = ALPHA;

    this.vel.x = 0;
    this.offset.y = -17;

    this.shieldHigh = true;
    this.noSwap = 0;

    this.state = IDLE;
    this.fn = 0;
};

Blocker.prototype.step = function() {
    if (this.fn >= 11) {
        this.fn = 4;
    } else {
        this.fn = 8;
    }
    this.walkCycle = 18;
    this.state = WALKING;
}

Blocker.prototype.attack = function() {
    this.walkCycle = -100;
    this.fn = 20;
    this.attackDur = 36;

    this.state = NORM_ATTK;
}

Blocker.prototype.update = function() {
    if (this.state == WALKING) {
        if (this.walkCycle <= -8) {
            this.step();
        }

        if (this.walkCycle > 0) {
            this.vel.x = 16/18 * this.dir;
            if (this.walkCycle == 9) {
                this.fn++;
            }
        } else {
            this.vel.x = 0;
            if (this.walkCycle == 0) {
                this.fn++;
            } else if (this.walkCycle == -4) {
                this.fn++;
            }   
        }

        if (this.vel.x != 0 && Tilemap.getTile(Math.floor(this.pos.x / 16), Math.floor(this.pos.y / 16 + 1)) == 0) {
            this.vel.x *= -1;
            this.dir *= -1;
        }
    } else if (this.state == NORM_ATTK) {
        if (this.attackDur > 0) {
            this.attackDur--;
            if (this.attackDur == 0) {
                this.fn = 0;
                this.state = IDLE;
            } else if (this.attackDur % 6 == 0) {
                this.fn++;

                if (this.attackDur == 24) {
                    this.addBox(new Box(this, 13 * this.dir, -7, 23 * this.dir, 6))
                } else if (this.attackDur == 12) {
                    this.boxes.length = 2;
                }
            }
        }
    } else if (this.state == -1) {
        this.boxes.length = 2;
        this.fn = 0;
        this.friction(0.5);
        if (this.vel.x == 0) {
            this.attack();
        }
    }

    this.walkCycle--;

    if (this.noSwap <= 0 && Math.floor(random(0, 500)) == 0) {
        // this.shieldHigh = !this.shieldHigh;
        this.noSwap = 60;
    }
    this.noSwap--;

    this.vel.y += 0.25;

    if (!this.shieldHigh) {
        this.boxes[1].y = -1;
    } else {
        this.boxes[1].y = -7;
    }

    Entity.prototype.update.call(this);
}

Blocker.prototype.updateGraphics = function() {
    if (this.fn == 0) {
        this.frameNumber = this.fn + (this.shieldHigh ? 0 : 1);
    } else {
        this.frameNumber = this.fn + (this.shieldHigh ? 0 : 8);
    }
    this.sprite.scale.x = this.dir;

    Entity.prototype.updateGraphics.call(this);
}

Blocker.prototype.hitWall = function(dir) {
    this.dir = -dir;
}
