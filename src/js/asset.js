var Asset = function(stageState, baseDir, asset) {
  this.stageState = stageState;
  this.game = stageState.game;
  this.asset = asset;
  this.baseDir = baseDir;
};

Asset.prototype = {

  stageState: {},

  game: {},

  baseDir: "",

  asset: {},

  loadAll: function() {
    for (var type in this.asset) {
      var load;
      switch (type) {
        case "images":
          load = this.game.load.image;
          break;
        case "sprites":
          load = this.game.load.sprite;
          break;
        case "videos":
          load = this.game.load.video;
          break;
        case "audios":
          load = this.game.load.audio;
          break;
        default:
          break;
      }
      for (var i = 0; i < this.asset[type].length; ++i) {
        var assetPath = this.baseDir + this.asset[type][i];
        load.call(this.game.load, assetPath, assetPath);
      }
    }
  },

  getAssetKey: function(fileName) {
    return this.baseDir + fileName;
  }

};
