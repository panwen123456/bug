import axios from "axios"
import url from './index'


function fetch(api, data) {
  return new Promise((resolve, reject) => {
    axios.post(url[api],data).then(res => {
      //统一做业务处理
      resolve(res.data)
    }).catch(err => {
      //无网络时本地异常处理
      if(process.env.NODE_ENV === 'production') {
        reject(err)
      } else {
        //只在开发的环境下进行mock处理
        console.error(err)
        let mock = require('../mock/index.js')
        resolve(mock[api])
      }
    })
  })
}

export default fetch