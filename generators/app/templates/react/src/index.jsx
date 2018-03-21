import React, {Component} from 'react'
import { render } from 'react-dom'
import { Layout, Radio } from 'antd'
import DataForm from './components/DataForm'
import EditForm from './components/EditForm'
import DataTable from './components/DataTable'
import css from './index.scss'

const { Header, Footer, Content } = Layout
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Root extends Component {
  state = {
    plan: 'a'
  }

  getRadioPlan() {
    return (
      <RadioGroup size="small" defaultValue={this.state.plan} onChange={(e)=>{this.setState({plan: e.target.value})}}>
        <RadioButton value="a">PlanA</RadioButton>
        <RadioButton value="b">PlanB</RadioButton>
      </RadioGroup>
    )
  }
  getPlan() {
    let plan = {
      a: (
          <div>
            <DataTable/>
            <DataForm/>
          </div>
         ),
      b: (
          <EditForm/>
         )
    }
    return plan[this.state.plan]
  }
  render() {
    return (
      <div className={css.main}>
         <Layout>
          <Header>
            <div className={css.header}>
              <span className={css.title}>双十一后台管理系统</span>
              {this.getRadioPlan()}
            </div>
          </Header>
          <Content className={css.content}>
            {this.getPlan()}
          </Content>
          <Footer></Footer>
        </Layout>
      </div>
    )
  }
}

render(
  <Root/>,
  document.getElementById('root')
)
