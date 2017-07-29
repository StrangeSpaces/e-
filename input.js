var Key = {
  _pressed: {},

  LEFT: [65, 37],
  UP: [32, 38],
  RIGHT: [68, 39],
  DOWN: [83, 40],
  R: [82, 82],
  P: [80, 80],
  
  isDown: function(keyCode) {
    return this._pressed[keyCode[0]] || this._pressed[keyCode[1]];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
