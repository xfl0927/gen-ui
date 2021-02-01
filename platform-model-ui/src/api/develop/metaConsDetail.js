import request from '@/utils/request'

const dictListApi = {
  findAll() {
    return request({
      url: '/develop/metaConsdetail/findAll',
      method: 'get'
    })
  }
}

export default dictListApi
