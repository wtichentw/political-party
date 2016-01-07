"use strict";

function drawLayersInOrder(layers, game) {
  if (!Array.isArray(layers)) {
    throw "Parameters of function drawLayersInOrder must be an array.";
  }

  for (var i = 0; i < layers.length; ++i) {
    var layer;
    if (Array.isArray(layers[i])) {
      layer = game.add.group();
      for (var j = 0; j < layers[i].length; ++j) {
        layer.add(layers[i][j]);
      }
    } else {
      layer = layers[i];
    }
    game.world.bringToTop(layer);
  }
}
