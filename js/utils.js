"use strict";

function drawLayersInOrder(layers, game) {
  if (typeof layers !== "object") {
    throw "The first parameter must be an object.";
  }

  var resultLayers = {};
  for (var key in layers) {
    var layer;
    if (Array.isArray(layers[key])) {
      layer = game.add.group();
      for (var i = 0; i < layers[key].length; ++i) {
        layer.add(layers[key][i]);
      }
    } else {
      layer = layers[key];
    }
    game.world.bringToTop(layer);
    resultLayers[key] = layer;
  }

  return resultLayers;
}
