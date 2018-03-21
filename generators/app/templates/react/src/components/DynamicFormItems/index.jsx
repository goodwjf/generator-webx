import React, {Component} from 'react'
import { Row, Col, Form, Input, InputNumber, TimePicker, DatePicker, Switch } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import MultipleDatePicker from '../MultipleDatePicker'
import MultipleTimePicker from '../MultipleTimePicker'
import { fieldsInfo } from '../../common/config.js'
moment.locale('zh-cn')

const { TextArea } = Input;
const FormItem = Form.Item
const dateFormat = 'YYYY/MM/DD'
const timeFormat = 'HH:mm:ss'

export default class DynamicFormItems extends Component {

  getValidator(key) {
    let field = fieldsInfo[key]

    let isNumber = (value) => {
      const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
      return (!isNaN(value) && reg.test(value))
    }

    let isUrl = (url) => {
       let reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
       return reg.test(url)
    }

    let config = {
      'url': {
        func: isUrl,
        msg: '请输入正确的URL'
      },
      'number': {
        func: isNumber,
        msg: '请输入数字'
      }
    }

    let arr = []
    if (field.validator) {
      let checker = config[field.validator];
      let _validator = (rule, value, callback) => {
        if (checker.func(value)) {
          callback();
          return;
        }
        callback(checker.msg);
      }
      arr = [{ validator: _validator }]
    }
    return arr
  }

  getField(key, value) { // 根据类型使用不同的表单控件
    // console.log(fieldsInfo[key])
    const { getFieldDecorator, setFieldsValue } = this.props.form
    let field = fieldsInfo[key]
    let node = null
    let options = {}
    let msg = '该字段不能为空'
    let settings = {disabled: field.disabled}
    let _validator = this.getValidator(key)

    switch (field.type) {
       case "array|time":
        options = {
          initialValue: value,
          rules: [{ required: true, message: msg, type: 'array'}]
        }
        node = (
          <MultipleTimePicker placeholder={key} trace={true} control={true} { ...settings }/>
        )
        break;
       case "array|date":
        options = {
          initialValue: value,
          rules: [{ required: true, message: msg, type: 'array'}]
        }
        node = (
          <MultipleDatePicker placeholder={key}  { ...settings }/>
        )
        break;
      case "array":
        options = {
          initialValue: value,
          rules: [{ required: true, message: msg }]
        }
        node = (
          <TextArea placeholder={key}/>
        )
        break;
      case "date":
        value = moment(value || new Date(), dateFormat)
        options = {
          initialValue: value,
          rules: [{ required: true, message: msg }]
        }
        node = (
          <DatePicker format={ dateFormat } />
        )
        break;
      case "time":
        value = moment(value || new Date(), timeFormat)
        options = {
          initialValue: value,
          rules: [{ required: true, message: msg }]
        }
        node = (
          <TimePicker/>
        )
        break;
      case "boolean":
        options = {
          initialValue: value || false,
          valuePropName: 'checked'
        }
        node = (
          <Switch checkedChildren={field.switchLabel.checked} unCheckedChildren={field.switchLabel.unChecked} />
        )
        break;
      case "number":
        options = {
          initialValue: value,
          rules: [{ required: true, message: msg }, ..._validator]
        }
        node = (
          <InputNumber placeholder={key} min={0}/>
        )
        break;
      default:
        options = {
          initialValue: value,
          rules: [{ required: true, message: msg },  ..._validator]
        }
        node = (
          <Input placeholder={key} {...settings}/>
        )
        break;
    }
    return getFieldDecorator(key, options)(node)
  }

  getFields() {
    let fields = []
    let formData = this.props.formData;
    if (formData) {
      for (let key in fieldsInfo) { // 遍历fieldsInfo为了保证字段可控
        let settings = {
          label: fieldsInfo[key].title,
          wrapperCol: {span: 19 },
          labelCol: { span: 5 }
        }
        fields.push(
          <Col span={12} key={key}>
            <FormItem { ...settings }>
              {this.getField(key, formData[key])}
            </FormItem>
          </Col>
        )
      }
    }
    return fields
  }

  render() {
    return (
       <Row gutter={ 24 }>{ this.getFields() }</Row>
    )
  }
}
