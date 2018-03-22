import React, {Component} from 'react'
import { render } from 'react-dom'
import { Layout, Radio } from 'antd'
import MyCard from './components/MyCard'
import css from './index.scss'

const { Header, Footer, Content } = Layout

class Root extends Component {
  render() {
    return (
      <div className={css.main}>
         <Layout>
          <Header>
            <div className={css.header}>
              <span className={css.title}>webx</span>
            </div>
          </Header>
          <Content className={css.content}>
            <MyCard/>
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
