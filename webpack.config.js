const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin("client/dist/[name].css");

module.exports = {
  entry: './client/free-write.js',

  module: {
    rules: [
      {
        test: /\.(scss)$/,
//        loaders: ExtractTextPlugin.extract({
        loaders: extractCSS.extract({
          fallback: 'style-loader', // in case the ExtractTextPlugin is disabled, inject CSS to <HEAD>
          use: [{
            loader: 'css-loader', // translates CSS into CommonJS modules
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader', // compiles SASS to CSS
            options: {
              sourceMap: true
            }
          }]
        })
      }, 
      {
        test: /\.(css)$/,
        loaders: extractCSS.extract({
          fallback: 'style-loader', // in case the ExtractTextPlugin is disabled, inject CSS to <HEAD>
          use: [
            {
              loader: 'css-loader', // translates CSS into CommonJS modules
              options: {
                sourceMap: true
              }
            }
          ]
        })
      }, 
      {
        test: /\.html$/,
        use: [ 'file-loader?name=client/dist/[name].[ext]' ]
      }
    ],
  },
  
  plugins: [
    extractCSS,
    new webpack.ProvidePlugin({ // inject ES5 modules as global vars
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Tether: 'tether'
    })
  ],
  
  output: {
      filename: "client/dist/bundle.js",
  }
};
