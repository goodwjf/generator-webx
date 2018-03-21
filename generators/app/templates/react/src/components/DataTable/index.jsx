import React, { Component } from 'react'
import { Table, Icon, Divider, Button, Popconfirm, message, Switch, Spin, Modal } from 'antd'
import action from './action.js'
import { emptyRecord, primaryKey } from '../../common/config.js'
import Columns from './Columns.jsx'
import DataFormAction from '../DataForm/action.js'
import css from './index.scss'
const confirm = Modal.confirm

// 操作字段
let getEditer = (record, from) => {
  DataFormAction.showEditer(record, from)
}

let del = (record) => {
  action.remove(record)
}

function initColumns () {
  return new Columns().filter().sort().beautify().setControl({edit: getEditer, del, del}).values()
}

export default class DataTable extends Component {

  state = {
    list: [],
    loading: false,
    switchState: true,
    columns: [],
    selectedRowKeys: null
  }
  componentWillMount () {
     this._mounted = true
  }

  componentDidMount() {
    this.startLoading()
    this.setState({columns: initColumns()})
    action.mountLoading((topic, loading) => {
      this._mounted && this.setState({loading})
    })

    action.loadData((data) => {
      if (this._mounted) {
        let list = data.list
        let selectedRowKeys = list[0].namespace
        this.setState({list, selectedRowKeys})
        this.endLoading()
      }
    })

    action.mountAdd((topic, listItem, state) => {})

    action.mountUpdate((topic, listItem, state) => {})

    action.mountRemove((topic, listItem, state) => {
        message.success('删除成功', 1);
    })
  }

  componentWillUnmount() {
    action.unMountAdd()
    action.unMountUpdate()
    action.unMountReomve()
    action.unMountLoading()
    this._mounted = false
  }

  startLoading() {
    this.setState({loading: true})
  }

  endLoading() {
    this.setState({loading: false})
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

  getSettings() {
    return {
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
          ghost: true,
          type: "danger",
          className: css.spacing
        }
      },
      createButton: {
        ghost: true,
        type: "primary",
        className: css.spacing,
        onClick: () => { getEditer(emptyRecord, 'create') }
      },
      switchButton: {
        className: css.spacing,
        onChange: this.disabled,
        checkedChildren: "启用",
        unCheckedChildren: "禁用",
        checked: this.state.switchState
      },
      tableList: {
        columns: this.state.columns,
        rowKey: primaryKey,
        dataSource: this.state.list,
        rowSelection: {
          selectedRowKeys: this.state.selectedRowKeys,
          type: 'radio',
          onChange: (selectedRowKeys, selectedRows) => {
            this.setState({selectedRowKeys})
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          }
        }
      }
    }
  }

  render() {
    let { createButton, pushTest, pushOnline, switchButton, tableList } = this.getSettings()
    return (
      <div>
        <Spin spinning={ this.state.loading } delay={ 200 }>
          <div className={ css['button-box'] }>
            <Button { ...createButton }>
              <Icon type="plus" />新建
            </Button>
            <div>
              <Popconfirm { ...pushTest.pop }>
                <Button { ...pushTest.button }>发布到测试环境</Button>
              </Popconfirm>
              <Popconfirm { ...pushOnline.pop }>
                <Button { ...pushOnline.button }>发布到线上</Button>
              </Popconfirm>
              <Switch { ...switchButton }/>
            </div>
          </div>
          <Table { ...tableList}/>
        </Spin>
      </div>
    );
  }
}


