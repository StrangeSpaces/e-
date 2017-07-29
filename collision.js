var CollisionHandler = {
    handles: [],

    handle: function(a, b) {
        for (var i = 0; i < this.handles.length; i++) {
            var h = this.handles[i];

            if (h[0] == a.type && h[1] == b.type) {
                if (a.collide(b)) {
                    h[2](a, b);
                }
                return;
            } else if (h[1] == a.type && h[0] == b.type) {
                if (a.collide(b)) {
                    h[2](b, a);
                }
                return;
            }
        }
    }
}

CollisionHandler.handles.push([PLAYER, PLAYER, function(a, b) {
    a.pos.y -= a.vel.y;
}]);