var tiles = TileMaps['start']['layers'][0]['data'];

var Tilemap = {
    tileSize: 16,

    init: function() {
        for (var y = 0; y < 20; y++) {
            for (var x = 0; x < 20; x++) {
                var f = this.getTile(x, y) - 1;
                if (f >= 0) {
                    var frame = new PIXI.Rectangle(f % 4 * 16, Math.floor(f / 4) * 16, this.tileSize, this.tileSize);
                    var sprite = new PIXI.Sprite(new PIXI.Texture(resources['test'].texture, frame));

                    sprite.anchor.x = 0.5;
                    sprite.anchor.y = 0.5;

                    sprite.position.x = (x+0.5) * this.tileSize;
                    sprite.position.y = (y+0.5) * this.tileSize;

                    currentContainer.addChild(sprite);
                }
            }
        }
    },

    check: function(entity, axis) {
        var startX = Math.floor(entity.left() / this.tileSize);
        var startY = Math.floor(entity.top() / this.tileSize);

        var endX = Math.ceil(entity.right() / this.tileSize);
        var endY = Math.ceil(entity.bot() / this.tileSize);

        for (var y = startY; y < endY; y++) {
            for (var x = startX; x < endX; x++) {
                if (this.getTile(x, y) > 0) {
                    // if (x * this.tileSize < entity.right() &&
                    //     y * this.tileSize < entity.bot() &&
                    //     (x+1) * this.tileSize > entity.left() &&
                    //     (y+1) * this.tileSize > entity.top()) {

                        if (axis == 0) {
                            if ((x+0.5) * this.tileSize - entity.pos.x > 0) {
                                entity.pos.x = x * this.tileSize - entity.halfWidth;
                            } else {
                                entity.pos.x = (x+1) * this.tileSize + entity.halfWidth;
                            }
                        } else {
                            if ((y+0.5) * this.tileSize - entity.pos.y > 0) {
                                entity.pos.y = y * this.tileSize - entity.halfHeight;
                                if (entity.hitGround) entity.hitGround();
                            } else {
                                entity.pos.y = (y+1) * this.tileSize + entity.halfHeight;
                            }
                        }
                    // }
                }
            }
        }
    },

    getTile: function(x, y) {
        return tiles[y * 20 + x];
    }
}