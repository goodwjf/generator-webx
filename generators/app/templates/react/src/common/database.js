import { createPrimaryKey } from './common.js'

let DATA = {}
let DATA_BACKUPS = {}
let mainKey = 'namespace'

let updateItem = (item) => {
  let list = DATA.list
  list.map((_item, index) => {
    if(_item[mainKey] === item[mainKey]) {
      for (let key in item) {
        _item[key] = item[key]
      }
    }
  })
}

let delItem = (item) => {
  let list = DATA.list
  list.map((_item, index) => {
    if(_item[mainKey] === item[mainKey]) {
      list.splice(index, 1)
    }
  })
}

let addItem = (item) => {
  DATA.list.push(item)
}

let save = (data) => {
  data.list.map((item) => {
     if(!item.namespace) {
      item.namespace = createPrimaryKey()
     }
  })
  DATA = data
}

let get = () => {
  DATA_BACKUPS = JSON.parse(JSON.stringify(DATA))
  return DATA
}

let rollBack = () => {
  DATA = JSON.parse(JSON.stringify(DATA_BACKUPS))
}

export default {
  updateItem,
  delItem,
  addItem,
  save,
  get,
  rollBack
}