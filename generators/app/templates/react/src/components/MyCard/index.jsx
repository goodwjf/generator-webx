import React, {Component} from 'react'
import { Card, Icon } from 'antd'

export default class myCard extends Component {
   render() {
   let card = {
      title: <span><Icon type="credit-card" /> 表单 </span>,
      style:{
        width: 1000,
        margin: 'auto'
      }
    }
    return (
      <Card { ...card }>
        <h2>Hello webx</h2>
      </Card>
    )
  }
}
