var Generator = require('yeoman-generator');
var yosay = require('yosay-sogou');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');

module.exports = class extends Generator {
  prompting () {

    this.log(yosay('welcome to ' + chalk.red('webx')))
    this.name = path.basename(process.cwd());
    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: chalk.yellow('Please enter the project ') + chalk.red('name') + chalk.yellow(' .'),
        default: this.name
      },
      {
        type: 'list',
        name: 'tools',
        message: chalk.yellow('Please select development ') + chalk.red('type') + chalk.yellow(' .'),
        choices: [
          {
            name: 'H5',
            value: 'h5'
          },
          {
            name: 'React',
            value: 'react'
          }
        ]
      },
      {
        type: 'list',
        name: 'demo',
        message: chalk.yellow('Whether to create an ') + chalk.red('instance') + chalk.yellow(' ?'),
        choices: [
          {
            name: 'yes',
            value: true
          },
          {
            name: 'no',
            value: false
          }
        ]
      }
    ]

    return this.prompt(prompts).then((props) => {
      this.name = props.name;
      this.tools = props.tools;
      this.demo = props.demo;
      this.sourceRoot(path.join(__dirname,'./templates/') + this.tools );
    })
  }

  writing() {
    if (this.tools === 'react') {
      this.demo && this.fs.copy(this.templatePath('src'), 'src')
      this.fs.copy(this.templatePath('config'), 'config')
      this.fs.copy(this.templatePath('.babelrc'), '.babelrc')
      this.fs.copy(this.templatePath('package.json'), 'package.json')
      this.fs.copy(this.templatePath('postcss.config.js'), 'postcss.config.js')
      this.demo && this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('src/index.html'),
        { title: this.name }
      );
    }

    if (this.tools === 'h5') {
      this.demo && this.fs.copy(this.templatePath('src'), 'src')
      this.fs.copy(this.templatePath('package.json'), 'package.json')
      this.fs.copy(this.templatePath('webpack.config.js'), 'webpack.config.js')
      this.demo && this.fs.copyTpl(
        this.templatePath('tpl.html'),
        this.destinationPath('src/index/tpl.html'),
        { title: this.name }
      );
    }

    let desSrc = this.destinationPath('src')
    if (!fs.existsSync(desSrc)) {
       fs.mkdirSync(desSrc)
    }

  }

  end() {
    this.log(chalk.green('Installation dependencies'))
    this.npmInstall().then((e)=>{
      this.log(chalk.green('Installed'))
      this.log(yosay('Have a nice meal'))
    })
  }
}