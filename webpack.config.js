const { join } = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    content_script: join(__dirname, 'src/chrome/content-script.ts'),
    service_worker: join(__dirname, 'src/chrome/service-worker.ts')
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [{
            loader: 'ts-loader',
            options: {
                configFile: "tsconfig.chrome.json"
            }
        }],
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: join(__dirname, './dist/audate'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
};
