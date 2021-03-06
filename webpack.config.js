//basic vars
const webpack = require('webpack');
const path = require('path');

//plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const isProduction = (process.env.NODE_ENV === 'production');

module.exports = {
  //basic path to project
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: ['./app/app.js', './app/scss/main.scss'],
    admin: ['./admin/admin-app.js', './admin/scss/admin-main.scss']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/js'),
    publicPath: "../"
  },
  devtool: (isProduction) ? '' : 'inline-source-map',
  module: {
    rules: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader"},

      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {sourceMap: true}
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [
                  require('autoprefixer')()
                ]
              }
            },
            {
              loader: 'sass-loader',

            }
          ],
          fallback: "style-loader",
        })
      },

      // images
      {
        test: /\.(png|gif|jpe?g)$/,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            },
          },
          'img-loader'
        ]
      },

      // fonts
      {
        test : /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {name: '[path][name].[ext]'}
          }
        ]
      },

      // SVG
      {
        test: /\.svg$/,
        loader: 'svg-url-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("../css/[name].css"),
    // new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin(
      [{from: './img', to: '../img'}, {from:'./index.html', to: '../'}],
      {ignore: [{glob: 'svg/*'}]}
    )
  ]
};

if (isProduction) {
  module.exports.plugins.push(
    new UglifyJSPlugin({sourceMap: true})
  );
  module.exports.plugins.push(
    new ImageminPlugin({
      test: /\.(png|jpe?g|dif|svg)$/i
    })
  );
  module.exports.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize:true
    })
  );
}