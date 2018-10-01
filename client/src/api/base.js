import http from '@/utils/http'
import md5 from 'js-md5'

let path = 'base'

let login = async (data) => {
  let url = path + '/login'
  let d = {
    'username': data.username,
    'password': md5(data.password)
  }
  let result = await http.post(url, d)
  return result
}

let getSetting = async (data = {}) => {
  let url = path + '/getSetting'
  let result = await http.get(url, data)
  return result
}

export default{
  login,
  getSetting
}
