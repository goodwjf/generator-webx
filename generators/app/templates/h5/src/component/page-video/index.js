import css from 'component/scss/page.scss'
import render from './tpl.xhtml'
export default function (data, utils) {
  data.visit = formatVisitedCount(data.visit)
  return render(data, utils, css)
}

// 格式化播放次数
function formatVisitedCount (c) {
  if (c >= 10000) {
    var k = (c / 10000).toFixed(2)
    return k + '万'
  }
  return c
}
