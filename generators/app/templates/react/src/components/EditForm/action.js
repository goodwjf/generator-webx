import request from '../../common/request.js'
import database from '../../common/database.js'

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
  // 测试代码
  setTimeout(()=>{
    callback({state: true})
    console.log(database.get())
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
    }
  }).catch((error) => {
      database.rollBack()
  })
}

let loadData = (callback) => {
  let url = './data.json'
  get(url).then((response) => {
    if (response.status === 200) {
      let data = response.data
      database.save(data)
      console.log(data)
      callback(data.list[0])
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

let save = (item, callback) => {
  database.updateItem(item)
  syncData((response) => {
    callback(response.state)
  })
}

export default {
  save,
  loadData,
  online,
  pushTest,
  disabled,
}