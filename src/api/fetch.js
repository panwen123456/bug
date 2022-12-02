import axios from "axios"
import url from './index'
import mock from '../mock'

function fetch(api, data) {
  return new Promise((resolve, reject) => {
    axios.post(url[api],data).then(res => {
      //统一做业务处理
      resolve(res.data)
    }).catch(err => {
      //无网络时本地异常处理
      console.error(err)
      resolve(mock[api])
    })
  })
}

export default fetch