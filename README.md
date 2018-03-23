

# generator-webx
web前端开发的脚手架

### 使用脚手架（generator-webx）

##### 首先确保自己安装了nodejs，然后全局安装yeoman
npm install -g yo

##### 然后直接安装脚手架
npm install -g generator-webx

##### 安装Yarn包管理工具(可选)
npm install -g yarn
> 安装后需要手动开启 yo webx yarn --yes | --no， 建议安装并开启（这样项目依赖包安装会更快）

##### 在合适的地方新建一个文件夹，在文件夹下运行：
yo webx

##### 选择项目类型

目前支持类型： H5、 React （后续会支持的更多...）

##### 是否生成实例

> 首次使用建议选择 yes 构建后会生成一个demo 有助于更好的理解开发方式

##### 然后就会在此目录下生成以下目录结构：
```
H5：

├── src
│   ├── components
│   │
│   ├── common
│   │
│   ├── third
│   │
│   ├── index
│   │
│   ├── utils
│   │
├── node_modules
├── package.json
└── webpack.config.js


React：

├── config
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── src
│   ├── components
│   │
│   ├── common
│   │
│   ├── static
│   │
│   ├── index.jsx
│   │
│   ├── index.html
│   │
│   ├── index.scss
│   │
├── node_modules
├── .babelrc
├── package.json
└── postcss.config.js
```

##### 然后使用以下命令：

项目开发过程使用，启动服务，实时刷新</br>
npm run dev

开发完成之后打包文件</br>
npm run pro

