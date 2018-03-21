var path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// __dirname 是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
// config
const CURRENT_PATH = path.resolve(__dirname); // 获取到当前目录
const ROOT_PATH = path.join(__dirname, '../'); // 项目根目录

const scriptOutPut = 'script'
const cssOutPut = 'style'
const imagesOutPut = 'images'

const out = ROOT_PATH + '/dist'
const input = ROOT_PATH + '/src/index.jsx'


function initCssLoader () {
  return {
    loader: 'css-loader',
    options: {
      modules: true,
      minimize: true,
      sourceMap: true,
      importLoaders: 2  //在css-loader前应用的loader的数目, 默认为0
    }
  }
}
const config = {
  context: CURRENT_PATH, // 设置webpack配置中指向的默认目录为项目根目录
  devtool: 'eval-source-map',
  entry: input,
  output: {
    path: out,
    filename: scriptOutPut + '/bundle-[hash].js'
  },
  devServer: { // webpack输出真实的文件，而webpack-dev-server输出的文件只存在于内存中,不输出真实的文件！
    contentBase: out,
    historyApiFallback: true,
    inline: true,
    hot: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [initCssLoader(), 'postcss-loader', 'sass-loader']
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: imagesOutPut + '/[name].[ext]' + '?v=[hash]',
              publicPath: '/'
            }
          }
        ]
      },
      {
        test: /\.(?:html)$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false,
              interpolate: 'require',
              attrs: ['img:data-src', 'div:data-src', 'img:src', 'link:href', 'script:src']
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin({ filename: cssOutPut + '/[name].css' }),
    new HtmlWebpackPlugin({
      template: ROOT_PATH + '/src/index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: scriptOutPut + '/commons.js'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {    // 压缩;
        warnings: false     // 关闭警告;
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin([out])
  ]
}

module.exports = config
