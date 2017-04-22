module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'index.js'
  },
  resolve: {
    alias: {
      fae: 'fae/src/index.js'
    }
  },
  node: {
    fs: 'empty'
  }
}
