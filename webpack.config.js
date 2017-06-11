const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin("client/dist/[name].css");

module.exports = {
  entry: ['bootstrap-loader', './client/free-write.js'],

  module: {
    rules: [
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
      Tether: 'tether',
      "window.Tether": "tether",
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      Button: "exports-loader?Button!bootstrap/js/src/button",
      Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/src/dropdown",
      Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Util: "exports-loader?Util!bootstrap/js/dist/util",      
    })
  ],
  
  output: {
      filename: "client/dist/bundle.js",
  }
};
