var path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

// __dirname 是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
// config
const CURRENT_PATH = path.resolve(__dirname); // 获取到当前目录
const ROOT_PATH = path.join(__dirname, '../'); // 项目根目录
const out = ROOT_PATH + '/dist'
const input = ROOT_PATH + '/src/index.jsx'
function initCssLoader (n, m) {
  return {
    loader: 'css-loader',
    options: {
      modules: m,
      minimize: true,
      sourceMap: true,
      importLoaders: n  //在css-loader前应用的loader的数目, 默认为0
    }
  }
}


let proxyUrl = 'http://itoutiao.sogou.com/v1/getnewslist/?h=45086835-e595-455f-b4a4-4552b6d4802b&imei=45086835-e595-455f-b4a4-4552b6d4802b&b=%E6%8E%A8%E8%8D%90&callback=jQuery111304706642922294568_1518089684352&_=1518089684353'
const config = {
  devtool: 'eval-source-map',
  entry: input,
  output: {
    path: out,
    filename: 'bundle-[hash].js'
  },
  devServer: { // webpack输出真实的文件，而webpack-dev-server输出的文件只存在于内存中,不输出真实的文件！
    contentBase: out,
    historyApiFallback: true,
    inline: true,
    hot: true,
    proxy: {
      '/test/*': {
        target: proxyUrl,
        secure: false,
        changeOrigin: true
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', 'scss'],
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', initCssLoader(1, false), 'postcss-loader']},
      { test: /\.scss$/, use: ['style-loader', initCssLoader(2, true), 'postcss-loader', 'sass-loader'], exclude: /node_modules/ },
      { test: /\.(png|svg|jpg|gif)$/, use: 'url-loader' },
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
    new HtmlWebpackPlugin({
      template: ROOT_PATH + '/src/index.html',
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = config
