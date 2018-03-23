var Generator = require('yeoman-generator');
var yosay = require('yosay-sogou');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('yarn', { type: String, required: false });
    this.option('y')
    this.option('n')
    this.work = true
  }

  help() {
    return 'Please visit -> ' + chalk.gray.underline('https://www.npmjs.com/package/generator-webx?activeTab=readme')
  }

  initializing () {
    if (this.options.yarn === 'yarn') {
      this.work = false
      if(this.options.yes || this.options.no) {
        let name = ''
        if (this.options.yes) {
          this.config.set('yarn', true)
          name = 'yarn'
        }
        if (this.options.no) {
          this.config.set('yarn', false)
          name = 'npm'
        }
        this.log(chalk.gray('Package management tool set to ') + chalk.red(name))
      } else {
        this.log(chalk.gray('The command ') + chalk.red('yarn') + chalk.gray(' is missing parameters'))
      }
    }
  }

  prompting () {
    if (!this.work) {
      return
    }
    this.log(yosay('welcome to ' + chalk.red('webx')))
    this.name = path.basename(process.cwd());
    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: chalk.gray('Please enter the project ') + chalk.red('name') + chalk.gray(' .'),
        default: this.name
      },
      {
        type: 'list',
        name: 'tools',
        message: chalk.gray('Please select development ') + chalk.red('type') + chalk.gray(' .'),
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
        message: chalk.gray('Whether to create an ') + chalk.red('instance') + chalk.gray(' ?'),
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
    if (!this.work) {
      return
    }
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

  install() {
    if (!this.work) {
      return
    }
    this.log(chalk.red(this.config.get('yarn') ? ' Yarn ' : ' Npm ') + chalk.green(' installation dependencies'))
    if (this.config.get('yarn')) {
      this.yarnInstall()
    } else {
      this.npmInstall()
    }
  }

  end() {
    if (!this.work) {
      return
    }
    this.log(chalk.green('Installed'))
    this.log(yosay('Have a nice meal'))
  }
}

