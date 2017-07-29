var CollisionHandler = {
    handles: [],

    handle: function(a, b) {
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
    }
}]);