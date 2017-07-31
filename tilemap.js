var level = 'start';

var tiles = TileMaps[level]['layers'][1]['data'];
var bg = TileMaps[level]['layers'][0]['data'];
var placement = TileMaps[level]['layers'][2]['data'];
var fg = TileMaps[level]['layers'][3]['data'];
var tileMapWidth = TileMaps[level]['width'];
var tileMapHeight = TileMaps[level]['height'];
var cols = TileMaps[level]['tilesets'][0]['columns']

var SX = null;

var Tilemap = {
    tileSize: 16,

    init: function() {
        for (var y = 0; y < tileMapHeight; y++) {
            for (var x = 0; x < tileMapWidth; x++) {
                this.place(bg[y * tileMapWidth + x] - 1, x, y, currentContainer);
            }
        }
        for (var y = 0; y < tileMapHeight; y++) {
            for (var x = 0; x < tileMapWidth; x++) {
                this.place(tiles[y * tileMapWidth + x] - 1, x, y, currentContainer);
            }
        }
        for (var y = 0; y < tileMapHeight; y++) {
            for (var x = 0; x < tileMapWidth; x++) {
                this.place(fg[y * tileMapWidth + x] - 1, x, y, frontContainer);
            }
        }
        for (var y = 0; y < tileMapHeight; y++) {
            for (var x = 0; x < tileMapWidth; x++) {
                var ent = placement[y * tileMapWidth + x] - 1;
                var entity = null;
                if (ent == 16) {
                    entity = new Chucker();
                } else if (ent == 25) {
                    SX = x * 16 + 8;
                    SY = y * 16;
                }

                if (entity) {
                    console.log('create');
                    entity.pos.x = (x + 0.5) * this.tileSize;
                    entity.pos.y = y * this.tileSize;
                    entities.push(entity);
                }
            }
        }
    },

    place(f, x, y, con) {
        if (f >= 0) {
            var frame = new PIXI.Rectangle(f % cols * 16, Math.floor(f / cols) * 16, this.tileSize, this.tileSize);
            var sprite = new PIXI.Sprite(new PIXI.Texture(resources['tiles'].texture, frame));

            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;

            sprite.position.x = (x+0.5) * this.tileSize;
            sprite.position.y = (y+0.5) * this.tileSize;

            con.addChild(sprite);
        }
    },

    check: function(entity, axis) {
        if (entity.moveThroughWalls) return;

        var startX = Math.floor(entity.left() / this.tileSize);
        var startY = Math.floor(entity.top() / this.tileSize);

        var endX = Math.ceil(entity.right() / this.tileSize);
        var endY = Math.ceil(entity.bot() / this.tileSize);

        for (var y = startY; y < endY; y++) {
            for (var x = startX; x < endX; x++) {
                if (this.getTile(x, y) != 0) {
                    // if (x * this.tileSize < entity.right() &&
                    //     y * this.tileSize < entity.bot() &&
                    //     (x+1) * this.tileSize > entity.left() &&
                    //     (y+1) * this.tileSize > entity.top()) {

                        if (axis == 0) {
                            if ((x+0.5) * this.tileSize - entity.pos.x > 0) {
                                entity.pos.x += x * this.tileSize - entity.right();
                                entity.hitWall(1);
                            } else {
                                entity.pos.x += (x+1) * this.tileSize - entity.left();
                                entity.hitWall(-1);
                            }
                        } else {
                            if ((y+0.5) * this.tileSize - entity.pos.y > 0) {
                                entity.pos.y = y * this.tileSize - entity.halfHeight;
                                entity.hitGround();
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
        return tiles[y * tileMapWidth + x];
    }
}