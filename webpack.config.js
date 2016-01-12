module.exports = {
  context: __dirname,
  entry: './src/main.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.woff2/,
        include: __dirname + '/src/assets/fonts',
        loader: 'url',
        query: {
          mimetype: 'font/woff2'
        }
      },
      {
        test: /\.css$/,
        include: [
          __dirname + '/src',
          __dirname + '/lib'
        ],
        loader: 'style!css'
      },
      {
        test: /phaser\.js$/,
        include: __dirname + '/lib',
        loader: 'imports',
        query: {
          PIXI: 'pixi'
        }
      },
      {
        test: /\.js$/,
        include: [
          __dirname + '/src'
        ],
        exclude: [
          __dirname + '/src/js'
        ],
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    alias: {
      pixi: __dirname + '/lib/phaser/pixi.js',
      phaser: __dirname + '/lib/phaser/phaser.js',
      normalizeCss: __dirname + '/lib/normalize.css/normalize.css'
    }
  }
};
