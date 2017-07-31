var CollisionHandler = {
    handles: [],

    handle: function(a, b) {
        if (!a || !b) return
        for (var i = 0; i < this.handles.length; i++) {
            var h = this.handles[i];

            if (h[0] == a.type && h[1] == b.type) {
                var boxes = a.collide(b)
                if (boxes) {
                    h[2](a, b, boxes);
                }
                return;
            } else if (h[1] == a.type && h[0] == b.type) {
                var boxes = b.collide(a)
                if (boxes) {
                    h[2](b, a, boxes);
                }
                return;
            }
        }
    }
}

CollisionHandler.handles.push([PLAYER, ENEMY, function(player, enemy, boxes) {
    if (boxes[0] > 0) {
        enemy.dead = true;

        for (var i = 0; i < 4; i++) {
            var eng = new Energy();
            entities.push(eng);

            var dx = random(-5, 5)

            eng.pos.x = enemy.pos.x + dx;
            eng.pos.y = enemy.pos.y;

            eng.vel.x = dx/5;
            eng.vel.y = random(-2, -1.5)
        }
    } else {
        player.damage();
    }
}]);

CollisionHandler.handles.push([PLAYER, ENERGY, function(player, energy, boxes) {
    if (boxes[0] != 0) return;

    var dif = new Vec(player.pos.x - energy.pos.x, player.pos.y - energy.pos.y);

    if (dif.length() < 8) {
        energy.dead = true;
        player.energy += 0.07;
        if (player.energy >= 1) player.energy = 1;
    } else {
        dif.setLength(1);
        energy.pos.x += dif.x;
        energy.pos.y += dif.y;
    }
}]);

CollisionHandler.handles.push([PLAYER, SAW, function(player, saw, boxes) {
    if (saw.struck) return;

    if (boxes[0] > 0) {
        saw.struck = true;
        saw.vel.x = player.dir * 3;
        saw.vel.y = 0;
        saw.arc = false;
    } else {
        player.damage();
        saw.dead = true;
    }
}]);

CollisionHandler.handles.push([SAW, ENEMY, function(saw, enemy, boxes) {
    if (!saw.struck) return;

    saw.dead = true;
    enemy.dead = true;

    for (var i = 0; i < 4; i++) {
        var eng = new Energy();
        entities.push(eng);

        var dx = random(-5, 5)

        eng.pos.x = enemy.pos.x + dx;
        eng.pos.y = enemy.pos.y;

        eng.vel.x = dx/5;
        eng.vel.y = random(-2, -1.5)
    }
}]);

CollisionHandler.handles.push([PLAYER, ALPHA, function(player, enemy, boxes) {
    if (boxes[0] > 0) {
        if (boxes[1] == 0) {
            enemy.damage();
        }

        enemy.vel.x = player.dir * 3;
        enemy.state = -1;
    } else if (boxes[1] > 1) {
        player.damage();
    }
}]);

CollisionHandler.handles.push([PLAYER, LIGHT, function(player, light, boxes) {
    if (boxes[0] > 0) {
        light.dead = true;

        for (var i = 0; i < 4; i++) {
            var eng = new Energy();
            entities.push(eng);

            var dx = random(-5, 5)

            eng.pos.x = light.pos.x + dx;
            eng.pos.y = light.pos.y;

            eng.vel.x = dx/5;
            eng.vel.y = random(-2, -1.5)
        }        
    }
}]);
