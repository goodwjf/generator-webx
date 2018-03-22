export function formatdatetime (format = 'Y-M-D', date = new Date()) {
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var obj = {
    'Y': date.getFullYear(),
    'y': date.getYear(),
    'M': month < 10 ? ('0' + month) : month,
    'm': month,
    'D': day < 10 ? ('0' + day) : day,
    'd': day,
    'H': hour < 10 ? ('0' + hour) : hour,
    'h': hour,
    'I': minute < 10 ? ('0' + minute) : minute,
    'i': minute,
    'S': second < 10 ? ('0' + second) : second,
    's': second
  }
  return format.replace(/([YMDHISymdhis])/g, function () {
    return obj[arguments[1]]
  })
}

export function formattime (timestamp) {
  var time = Date.now() - timestamp
  time = +time <= 0 ? 0 : time
  var second = 1000
  var minute = 60 * second
  var hour = 60 * minute
  var day = 24 * hour
  var month = 30 * day // 模糊需求.
  var year = 12 * month
  if (time <= second) return '刚刚'
  var list = [
    [year, '年'],
    [month, '个月'],
    [day, '天'],
    [hour, '小时'],
    [minute, '分钟'],
    [second, '秒']
  ]
  var tmp
  var ret = ''
  for (var i = 0, l = list.length; i < l; ++i) {
    tmp = time / list[i][0]
    if (tmp >= 1) {
      ret = parseInt(tmp, 10) + list[i][1]
      break
    } else {
      time = time % list[i][0]
    }
  }
  ret += '前'
  return ret
}

export function format (timestamp) {
  var diff = (new Date()).getTime() - timestamp
  if (diff > 2 * 24 * 60 * 60 * 1000) {
    if (formatdatetime('Y', new Date(timestamp)) < formatdatetime('Y', new Date())) {
      return formatdatetime('Y-M-D', new Date(timestamp))
    } else {
      return formatdatetime('M-D', new Date(timestamp))
    }
  } else {
    return formattime(timestamp)
  }
}
