import React, {Component} from 'react'
import { Modal, Row, Col, Form, Switch, Icon, Button, Spin } from 'antd'
import DynamicFormItems from '../DynamicFormItems'
import action from './action.js'
import DataTableAction  from '../DataTable/action.js'
import { fieldsInfo, primaryKey } from '../../common/config.js'
import { createPrimaryKey } from '../../common/common.js'
import css from './index.scss'

const FormItem = Form.Item
const dateFormat = 'YYYY/MM/DD'
const timeFormat = 'HH:mm:ss'

class _DataForm extends Component {

  state = {
    modalVisible: false,
    formData: null,
    from: null
  }

  componentDidMount() {
    action.mountEditer((topic, formData, from) => {
      if (from === 'create') {
        formData[primaryKey] = createPrimaryKey()
      }
      this.setState({modalVisible: true ,formData, from})
    })
  }

  componentWillUnmount() {
    action.unMountEditer()
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible })
  }
  _getFieldsValue () {
    const { getFieldsValue } = this.props.form
    let valObj = getFieldsValue()
    //console.log(valObj)
    for (let key in valObj) {
      let type = fieldsInfo[key].type
      let value = ''
      switch (type) {
        case "date":
          value = valObj[key].format(dateFormat)
          break;
        case "time":
          value = valObj[key].format(timeFormat)
          break;
        default:
          value = valObj[key]
          break;
      }
      valObj[key] = value
    }
    return valObj
  }

  ok = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setModalVisible(false)
        let key = this.state.from === 'create' ? 'add' : 'update'
        DataTableAction[key](this._getFieldsValue())
      }
    });
  }

  cancel = (e) => {
    this.setModalVisible(false)
  }

  render() {
    let settings = {
      width: 900,
      title: "编辑",
      okText: "确认",
      cancelText: "取消",
      style: { top:0 },
      maskClosable: false,
      destroyOnClose: true,
      visible: this.state.modalVisible,
      wrapClassName: css['vertical-center-modal'],
      onOk: this.ok,
      onCancel: this.cancel
    }
    let url = 'http://10.142.93.140:8080/admin/commonUpload.do'
    return (
      <Modal { ...settings }>
        <Form>
          <DynamicFormItems formData={this.state.formData} form={this.props.form}/>
          <div className={ css.remark }>
            备注：请<a href={ url } target="_blank">点击此处</a>上传图片后，复制上传后的图片地址填写“图片地址”字段
          </div>
        </Form>
      </Modal>
    )
  }
}

export default Form.create({})(_DataForm)