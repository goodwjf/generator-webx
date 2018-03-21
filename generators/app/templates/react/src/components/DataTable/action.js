import PubSub from 'pubsub-js'
import request from '../../common/request.js'
import database from '../../common/database.js'

let pubsubAdd = null;
let pubsubUpdate = null;
let pubsubRemove = null;
let pubsubLoading = null;

let { get, post, axios } = request((requestData) => {
    // 发送请求之前做数据转换
    if (requestData) {
      let list = requestData.list
      list.map((item) => {
        item.reminder = item.reminder ? 1 : 0
      })
      requestData = JSON.stringify(requestData)
    }
    return requestData
  }, (responseData) => {
    // 请求到数据后做数据转换
    responseData = JSON.parse(responseData)
    let list = responseData.list
    list.map((item) => {
      item.reminder = !!item.reminder
    })
    return responseData
  })

function runTestCode(callback) {
  setTimeout(()=>{
    callback({state: true})
    PubSub.publish('loading', false)
  }, 1000)
}
let syncData = (callback) => {
  // 测试模拟代码
  runTestCode(callback)
  return
  // 业务代码
  let url = './data.json'
  let data = database.get()
  post(url, data).then((response) => {
    if (response.status === 200) {
      callback({state: true})
    } else {
      database.rollBack()
      PubSub.publish('loading', false)
    }
  }).catch((error) => {
      database.rollBack()
      PubSub.publish('loading', false)
  })
}

let loadData = (callback) => {
  // 业务代码
  let url = './data.json'
  get(url).then((response) => {
    if (response.status === 200) {
      let data = response.data // data1: 服务端返回的数据对象
      database.save(data) // data2：自己去维护这个对象
      callback(data) // data3 : 给组件的 this.setState(data3) 使用
      /*
        data1, data2, data3 （指针，或引用）最终都是指向同一个地址（对象），
        当组件调用this.state.data的时候自然会访问 访问这个地址
        所以可以直接通过 database的增删修改后再调用 组件的this.setState() 来改变组件的ui变化
        (备注： 当执行 this.setState的时候 组件会调用render方法 ui发现变化)
      */
    }
  })
}

// action
let online = (callback) => {
  // 测试模拟代码
  runTestCode(callback)
  return
  // 业务代码
  let url = './data.json'
  // @todo根据实际接口调整参数
  axios.post(url, {namespace: ''}).then((response) => {
    if (response.status) {
      callback(response)
    }
  })
}

let pushTest = (callback) => {
  // 测试模拟代码
  runTestCode(callback)
  return
  // 业务代码
  let url = './data.json'
  // @todo根据实际接口调整参数
  axios.post(url, {namespace: ''}).then((response) => {
    if (response.status) {
      callback(response)
    }
  })
}

let disabled = (state, callback) => {
  // 测试模拟代码
  runTestCode(callback)
  return
  // 业务代码
  let url = './data.json'
  axios.post(url, {state: state}).then((response) => {
    if (response.status) {
      callback(state, response)
    }
  })
}

let add = (item) => {
  PubSub.publish('loading', true)
  PubSub.publish('add', item)
}

let update = (item) => {
  PubSub.publish('loading', true)
  PubSub.publish('update', item)
}

let remove = (item) => {
  PubSub.publish('loading', true)
  PubSub.publish('remove', item)
}

let mountLoading = (callback) => {
  pubsubLoading = PubSub.subscribe('loading', (topic, data) => {
    callback(topic, data)
  })
}
// mount
let mountAdd = (callback) => {
  pubsubAdd = PubSub.subscribe('add', (topic, item) => {
    database.addItem(item)
    syncData((response) => {
      callback(topic, item, response.state)
    })
  })
}

let mountUpdate = (callback) => {
  pubsubUpdate = PubSub.subscribe('update', (topic, item) => {
    database.updateItem(item)
    syncData((response) => {
      callback(topic, item, response.state)
    })
  })
}

let mountRemove = (callback) => {
  pubsubRemove = PubSub.subscribe('remove', (topic, item) => {
    database.delItem(item)
    syncData((response) => {
      callback(topic, item, response.state)
    })
  })
}

// unMount
let unMountAdd = () => {
  pubsubAdd && PubSub.unsubscribe(pubsubAdd)
}

let unMountUpdate = () => {
  pubsubUpdate && PubSub.unsubscribe(pubsubUpdate)
}

let unMountReomve = () => {
  pubsubRemove && PubSub.unsubscribe(pubsubRemove)
}

let unMountLoading = () => {
  pubsubLoading && PubSub.unsubscribe(pubsubLoading)
}

export default {
  mountAdd,
  mountUpdate,
  mountRemove,
  mountLoading,
  add,
  update,
  remove,
  loadData,
  online,
  pushTest,
  disabled,
  unMountAdd,
  unMountUpdate,
  unMountReomve,
  unMountLoading
}