var Generator = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var path = require('path');

module.exports = class extends Generator {
  prompting () {
    this.log(yosay('欢迎使用' + chalk.red('webx')))
    this.name = path.basename(process.cwd());
    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: chalk.yellow('请输入项目名称'),
        default: this.name
      },
      {
        type: 'list',
        name: 'tools',
        message: chalk.yellow('请选择开发类型'),
        choices: [
          {
            name: 'H5',
            value: 'h5'
          },
          {
            name: 'React',
            value: 'react'
          },
          {
            name: 'Vue',
            value: 'vue'
          }
        ]
      }
    ]

    return this.prompt(prompts).then((props) => {
      this.name = props.name;
      this.tools = props.tools;
      this.sourceRoot(path.join(__dirname,'./templates/') + this.tools )
    })
  }

  writing() {
    this.fs.copy(this.templatePath('src'), 'src')
    this.fs.copy(this.templatePath('config'), 'config')
    this.fs.copy(this.templatePath('.babelrc'), '.babelrc')
    this.fs.copy(this.templatePath('package.json'), 'package.json')
    this.fs.copy(this.templatePath('postcss.config.js'), 'postcss.config.js')
  }

  end() {
    this.npmInstall().then((e)=>{
      this.log(yosay('环境已生成，可以开发了'))
    })
  }
}