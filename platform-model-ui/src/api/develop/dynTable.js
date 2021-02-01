import request from '@/utils/request'

const dynTable = {
  /**
   * 动态表格
   * @param entityId 实体ID
   * @returns {AxiosPromise}
   */
  getDynTableData(entityId) {
    return request({
      url: '/develop/dynamic/dynamicTable',
      method: 'get',
      params: {
        'entityId' : entityId
      }
    })
  },

  /**
   *
   */
  getDynFormData(entityId) {
    return request({
      url: '/develop/dynamic/dynamicForm',
      method: 'get',
      params: {
        'entityId' : entityId
      }
    })
  }
}

export default dynTable
