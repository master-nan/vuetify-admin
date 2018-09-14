import http from '@/utils/http'

let path = 'setting'

let index = async (data = {}) => {
  let url = path
  let result = await http.get(url, data)
  return result
}

let update = async (data) => {
  let url = path + '/' + data.id
  let result = await http.put(url, data)
  return result
}

export default{
  index,
  update
}
