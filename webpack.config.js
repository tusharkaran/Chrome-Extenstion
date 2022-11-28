const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    popup: './src/popup.jsx',
    contentScript:'./src/contentScript.jsx',
    options:'./src/options.jsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [{ test: /\.(js|jsx)$/,
    exclude: /node_modules/,
     use: {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env' ,'@babel/preset-react']
          }
     } 
    },
    {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    },
  
  ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './src/popup.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: 'src/options.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: "public" },
      ],
    }),
  ],
};