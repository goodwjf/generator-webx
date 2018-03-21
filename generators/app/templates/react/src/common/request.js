import axios from 'axios'
let request = (_transformRequest, _transformResponse) => {
  let config = {
    transformRequest: [function (data) {
      // 对 data 进行任意转换处理
      return _transformRequest(data);
    }],
    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
    transformResponse: [function (data) {
      // 对 data 进行任意转换处理
      return _transformResponse(data);
    }],
  }
  return {
    get(_url) {
      return axios.get(_url, config)
    },
    post(_url, _data) {
      return axios.post(_url, _data, config)
    },
    axios
  }
}


export default request