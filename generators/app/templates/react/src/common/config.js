/*
  title: field 的显示名
  dataIndex: field字段名
  hide: 在Table里是否显示该字段
  sort：在Table里该列字段是否可排序
  beautify: 是否美化value的显示
  -------------------------------------
  type: field类型
  defaultValue:  field默认值用于新建表单
  validator: 该字段要验证的类型 ['number', 'url']
  disabled: 字段是否可编辑
  switchLabel: 开关按钮状态的名字
*/

const fieldsConfig = {
  namespace: {
    title: '配置ID',
    type: 'string',
    defaultValue: '',
    disabled: true,
    primaryKey: true
  },
  blacklist: {
    title: '黑名单',
    type: 'array',
    defaultValue: [],
    hide: true
  },
  time: {
    title: '时间',
    type: 'array|time',
    hide: true,
    defaultValue: [],
    disabled: false
  },
  date: {
    title: '日期',
    type: 'array|date',
    hide: true,
    disabled: false,
    defaultValue: []
  },
  times: {
    title: '次数',
    type: 'number',
    defaultValue: 0,
    sort: true,
    validator: 'number'
  },
  day: {
    title: '间隔天数',
    type: 'number',
    defaultValue: 0,
    validator: 'number'
  },
  url: {
    title: '广告地址',
    type: 'string',
    defaultValue: '',
    hide: true,
    validator: 'url'
  },
  image: {
    title: '图片地址',
    type: 'string',
    defaultValue: '',
    hide: true,
    validator: 'url'
  },
  reminder: {
    title: '弹窗选项',
    type: 'boolean',
    defaultValue: false,
    sort: true,
    switchLabel: {
      checked: '启用',
      unChecked: '禁用'
    },
    beautify: true
  }
}

/*
  fieldsInfo: 根据dataIndex的值 返回该字段的相关信息
  emptyRecord: 新建Form表单需要的默认值
  columns：Table列表需要用到的配置
*/

function getConfig(fieldsInfo) {
  let columns = []
  let emptyRecord = {}
  let primaryKey = null
  for (let key in fieldsInfo) {
    let item = fieldsInfo[key]
    if (item.primaryKey) {
      primaryKey = key
    }
    emptyRecord[key] = item.defaultValue
    columns.push({
      dataIndex: key,
      title: item.title,
      key: key
    })
  }
  return {
   fieldsInfo,
   emptyRecord,
   primaryKey,
   columns
  }
}

let config = getConfig(fieldsConfig)

export let { fieldsInfo, emptyRecord, primaryKey, columns } = config
export default config