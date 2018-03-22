var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2f;',
  '\\': '&#x5c;',
  '%': '&#x0025;'
}

export function escape (string) {
  return String(string).replace(/[&<>"'/\\%]/g, function (key) {
    return entityMap[key]
  })
}
