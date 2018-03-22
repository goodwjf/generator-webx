var dev = process.env.NODE_ENV === 'development'

var path = require('path')
var fs = require('fs')
var webpack = require('webpack')
var argv = require('yargs').argv
var config = require('./package.json')

let d = argv.d ? argv.d : 'system'
let _config = config[d][process.env.SHARE ? 'share' : dev ? 'development' : 'production']
config.input = _config.input
config.output = _config.output
config.public = _config.public

// 清理 release 目录
var CleanWebpackPlugin = require('clean-webpack-plugin')
var cleanReleaseDirectory = new CleanWebpackPlugin([config.output], {
  root: __dirname,
  verbose: true,
  dry: false,
  allowExternal: true
})

// 生成最终静态文件(html)
// 向页面中插入脚本时, 保证脚本顺序
var HtmlWebpackPlugin = require('html-webpack-plugin')
function createInjectOrderMethod (orders) {
  return function (chunk1, chunk2) {
    var o1 = orders.indexOf(chunk1.names[0])
    var o2 = orders.indexOf(chunk2.names[0])
    return o1 > o2 ? 1 : -1
  }
}

// 针对 development 和 production 环境写 plugs/rules
var plugins = [
  cleanReleaseDirectory,
  new webpack.optimize.ModuleConcatenationPlugin()
]
var rules = []

// 读 ./src 目录下所有含有 index.js 文件目录.
// 同时生成 html 配置.
const entry = {}

var commonchunkname = 'vendor'
var basecommonchunk = []
if (dev === false) {
  basecommonchunk = [...basecommonchunk, commonchunkname]
}
var allchunks = [...basecommonchunk]

let list = fs.readdirSync(path.resolve(config.input))
for (let dir of list) {
  if (dir[0] === '_') continue
  let filename = path.resolve(config.input, dir, 'index.js')
  let exist = fs.existsSync(filename)
  if (exist) {
    entry[dir] = filename
    allchunks = [...allchunks, dir]
    let chunks = [...basecommonchunk, dir]
    plugins = [...plugins, new HtmlWebpackPlugin({
      filename: `${dir}.html`,
      template: path.resolve(config.input, dir, `tpl.html`),
      inject: 'head',
      chunks: ['manifest', ...chunks],
      chunksSortMode: createInjectOrderMethod(chunks),
      cache: true
    })]
  }
}

// common.
if (dev === false) {
  plugins = [...plugins, new webpack.optimize.CommonsChunkPlugin({
    names: [commonchunkname, 'manifest'],
    minChunks: 2,
    chunks: [...allchunks]
  })]
}

// css.
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var scssExtractText = new ExtractTextPlugin({
  allChunks: true,
  filename: dev ? 'style/[name].css' : 'style/[name].css?v=[contenthash]'
})

var componentExtractText = new ExtractTextPlugin({
  allChunks: true,
  filename: dev ? 'style/component.[name].css' : 'style/component.[name].css?v=[contenthash]'
})

plugins = [...plugins, scssExtractText, componentExtractText]

var baseCSSRules = [
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      plugins: function () {
        return [
          require('precss'),
          require('autoprefixer')
        ]
      }
    }
  },
  {
    loader: 'resolve-url-loader'
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true
    }
  }
]

rules = [...rules, {
  test: /\.scss$/,
  include: /component/,
  use: componentExtractText.extract({
    fallback: [
      {
        loader: 'style-loader',
        options: {
          singleton: true
        }
      }
    ],
    publicPath: '../',
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '_[hash:base64:5]',
          importLoaders: 3,
          sourceMap: true,
          minimize: !dev
        }
      },
      ...baseCSSRules
    ]
  })
}, {
  test: /\.scss$/,
  exclude: /component/,
  use: scssExtractText.extract({
    fallback: [
      {
        loader: 'style-loader',
        options: {
          singleton: true
        }
      }
    ],
    publicPath: '../',
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: false,
          importLoaders: 3,
          sourceMap: true,
          minimize: !dev
        }
      },
      ...baseCSSRules
    ]
  })
}
]

// js
if (dev === false) {
  var uglifyJavaScript = new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    sourceMap: true,
    output: {
      comments: false
    },
    compressor: {
      warnings: false
    }
  })
  plugins = [...plugins, uglifyJavaScript]
}

// image
var imageRuleConfig = {
  test: /\.(?:jpg|jpg-large|png|gif|svg|ttf|woff|eot|ico)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 1024,
        name: 'images/[name].[ext]' + (dev ? '' : '?v=[hash]')
      }
    }
  ]
}

if (dev === false) {
  // https://github.com/tcoopman/image-webpack-loader
  imageRuleConfig.use = [
    {
      loader: 'image-webpack-loader',
      query: {
        optipng: {
          optimizationLevel: 6
        },
        gifsicle: {
          interlaced: true
        },
        pngquant: {
          quality: '65-90',
          speed: 4
        },
        mozjpeg: {
          quality: 65,
          progressive: true
        }
      }
    },
    ...imageRuleConfig.use
  ]
}

rules = [...rules, imageRuleConfig]

let babelloader = {
  loader: 'babel-loader',
  query: {
    cacheDirectory: path.resolve(__dirname, 'cache'),
    plugins: ['transform-runtime'],
    presets: [
      ['es2015', { modules: false, loose: true }]
    ]
  }
}

module.exports = {
  context: __dirname,
  target: 'web',
  devtool: dev ? 'cheap-module-source-map' : 'source-map',
  resolveLoader: {
    alias: {
      // 'es6-string-template-loader': path.resolve(__dirname, './loader/es6-string-template-loader.js')
    }
  },
  resolve: {
    mainFields: ['jsnext:main', 'main', 'index'],
    extensions: ['*', '.js', '.css', '.scss', '.tpl', '.html', '.png', '.jpg'],
    modules: [
      'node_modules'
    ],
    alias: {
      zepto: path.resolve(__dirname, 'src/third/zepto.min.js'),
      swiper: path.resolve(__dirname, 'src/third/swiper.min.js'),
      component: path.resolve(__dirname, 'src/component'),
      common: path.resolve(__dirname, 'src/common'),
      utils: path.resolve(__dirname, 'src/utils')
    }
  },
  entry: entry,
  output: {
    filename: dev ? `script/[name].js` : `script/[name].js?v=[chunkhash]`,
    path: path.resolve(__dirname, config.output),
    sourceMapFilename: 'sourceMaps/[file].map',
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]',
    publicPath: config.public ? config.public : ''
  },
  externals: {
    'Swiper': 'window.Swiper',
    'Zepto': 'window.Zepto',
    'server': 'window.server'
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/third')
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 390,
              name: 'script/third/[name].[ext]'
            }
          }
        ]
      },
      // 转 JavaScript
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, 'src/third')
        ],
        use: [babelloader]
      },
      // 引入 css 文件
      {
        test: /\.css$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048,
              name: 'style/[name].[ext]?v=[hash]'
            }
          }
        ]
      },
      {
        test: /\.xhtml/,
        use: [
          babelloader,
          {
            loader: 'es6-string-template-loader'
          }
        ]
      },
      // 生成 html 文件
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
      ...rules
    ]
  }
}
