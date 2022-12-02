//本地出现无网络等异常状态时，可以利用本地数据进行mock
import Mock from 'mockjs'

let login = Mock.mock({
  "status": 200,
  "message": "短信验证码不正确",
  "data": {}
})

let getCode = Mock.mock({
  "status": 200,
  "message": "已发送信息",
  "data": {}
})

export {
  login,
  getCode
}