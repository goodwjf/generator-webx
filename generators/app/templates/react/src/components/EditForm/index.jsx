import React, {Component} from 'react'
import { message, Modal, Card, Popconfirm, Row, Col, Form, Switch, Icon, Button, Spin } from 'antd'
import DynamicFormItems from '../DynamicFormItems'
import action from './action.js'
import css from './index.scss'

const confirm = Modal.confirm;
const FormItem = Form.Item

class _EditForm extends Component {

  state = {
    cardLoading: true,
    switchState: true,
    loading: false,
    formData: null,
  }
  componentWillMount () {
    this._mounted = true
  }
  componentDidMount() {
    action.loadData((formData) => {
      this._mounted && this.setState({formData: formData, cardLoading: false})
    })
  }

  componentWillUnmount () {
    this._mounted = false
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        action.save(values, (s) => {
          message.success('保存成功', 1);
        })
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  startLoading() {
    this.setState({loading: true})
  }

  endLoading() {
    setTimeout(()=>{
      this.setState({loading: false})
    }, 1000)
  }

  online = () => {
    this.startLoading()
    action.online(() => {
      this.endLoading()
      message.success('发布成功', 1);
    })
  }

  ontest = () => {
    this.startLoading()
    action.pushTest(() => {
      this.endLoading()
      message.success('执行成功', 1);
    })
  }

  disabled = (state) => {
    let msg = state ? '启用' : '禁用'
    confirm({
      title: '该操作存在一定的风险请确认后执行',
      content: `确定要${msg}线上环境吗？`,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        this.startLoading()
        action.disabled(state, (s) => {
          let str = `已${msg}`
          this.endLoading()
          message.success(str, 1);
        })
        // Switch 使用的是checked属性 不是defaultChecked属性 需手动改变state状态
        this.setState({switchState: state})
      }
    })
  }
  render() {
   let settings = {
      pushTest: {
        pop: {
          okText: "是",
          cancelText:"否",
          onConfirm: this.ontest,
          title: "你确认要发布到测试吗?"
        },
        button: {
          ghost: true,
          type: "primary",
          className: css.spacing
        }
      },
      pushOnline: {
        pop: {
          okText: "是",
          cancelText: "否",
          okType: "danger",
          onConfirm: this.online,
          title: "你确认要发布到线上吗?",
        },
        button: {
          type: "danger",
          className: css.spacing
        }
      },
      switchButton: {
        className: css.spacing,
        onChange: this.disabled,
        checkedChildren: "启用",
        unCheckedChildren: "禁用",
        checked: this.state.switchState
      },
      cancelButton: {
        className: css.spacing,
        onClick: this.handleReset
      },
      saveButton: {
        htmlType: "submit",
        type: "primary",
        className: css.spacing
      },
      card: {
        loading: this.state.cardLoading,
        hoverable: true,
        title: <span><Icon type="credit-card" /> 表单 </span>,
        style:{
          width: 1000,
          margin: 'auto'
        }
      },
      spin: {
        spinning: this.state.loading,
        delay: 200
      }
    }
    let url = 'http://10.142.93.140:8080/admin/commonUpload.do'
    return (
      <Card { ...settings.card }>
       <Spin { ...settings.spin }>
        <Form onSubmit={this.handleSubmit}>
          <DynamicFormItems formData={this.state.formData} form={this.props.form}/>
          <Row>
            <div className={ css.remark }>
              备注：请<a href={ url } target="_blank">点击此处</a>上传图片后，复制上传后的图片地址填写“图片地址”字段
            </div>
          </Row>
          <Row>
            <Col span={ 12 }>
              <FormItem>
                <Switch { ...settings.switchButton }/>
                <Popconfirm { ...settings.pushOnline.pop }>
                  <Button { ...settings.pushOnline.button }>发布到线上</Button>
                </Popconfirm>
                <Popconfirm { ...settings.pushTest.pop }>
                  <Button { ...settings.pushTest.button }>发布到测试环境</Button>
                </Popconfirm>
              </FormItem>
            </Col>
            <Col span={ 12 } className={css.control}>
              <FormItem>
                <Button { ...settings.cancelButton }>重置</Button>
                <Button { ...settings.saveButton }>保存</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        </Spin>
      </Card>
    )
  }
}

export default Form.create({})(_EditForm)