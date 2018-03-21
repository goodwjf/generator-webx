import React from 'react'
import { Divider, Popconfirm } from 'antd'
import { columns, fieldsInfo } from '../../common/config.js'
import css from './index.scss'

export default class Columns {
  constructor() {
    this.fields = columns
  }

  values() {
    return this.fields
  }

  // 字段隐藏
  filter() {
    this.fields = this.fields.map((item) => {
      let field = fieldsInfo[item.dataIndex]
      if(field && field.hide) {
        item.className = css.hide
      }
      return item
    })
    return this
  }

  // 字段排序
  sort() {
    this.fields = this.fields.map((item) => {
      let key = item.dataIndex
      let field = fieldsInfo[key]
      if(field && field.sort) {
        let type = field.type
        item.sorter = (a, b) => {
          let result = 0
          let _a = a[key]
          let _b = b[key]
          switch (type) {
            case 'date':
              result = new Date(_a).getTime() - new Date(_b).getTime()
            break
            case 'number':
              result = _a - _b
            break
            case 'boolean':
              result = _a - _b
            break
            default:
              result = _a.length - _b.length
            break
          }
          return result
        }
      }
      return item
    })
    return this
  }
  // 字段值个性化
  beautify() {
    this.fields = this.fields.map((item) => {
      let key = item.dataIndex
      let field = fieldsInfo[key]
      if(field && field.beautify && field.switchLabel) {
        let labels = field.switchLabel
        let _config = {
          dotClassName: 'ant-badge-status-dot',
          textClassName: 'ant-badge-status-text',
          open: {
            text: labels.checked,
            className: 'ant-badge-status-processing',
          },
          close: {
            text: labels.unChecked,
            className: 'ant-badge-status-default',
          }
        }
        item.render = (state) => {
          let _s = state ? 'open' : 'close'
          let classNames = [css[_config.dotClassName], css[_config[_s].className]].join(" ")
          return (
            <div>
              <span className={classNames}></span>
              <span className={css[_config.textClassName]}>{_config[_s].text}</span>
            </div>
          )
        }
      }
      return item
    })
    return this
  }
  //设置操作
  setControl(opt) {
    let toolsField = {
      title: '操作',
      render: (text, record) => (
        <span>
          <a href="#" onClick={() => opt.edit(record, 'edit')}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确认删除?" onConfirm={() => opt.del(record)} okText="是" cancelText="否">
            <a href="#">删除</a>
          </Popconfirm>
        </span>
      )
    }
    this.fields.push(toolsField)
    return this
  }
}
