import request from '@/utils/request'

const drinkApi = {

  /**
   * 保存【饮品】
   */
  insert(drink) {
    return request({
      url: '/platformModel/drink/insert',
      method: 'post',
      data: drink
    })
  },
  /**
   * 保存【饮品】
   */
  insertBatch(drink) {
    return request({
      url: '/platformModel/drink/insertBatch',
      method: 'post',
      data: drink
    })
  },

  /**
  * 修改【饮品】
  */
  update(drink) {
    return request({
      url: '/platformModel/drink/update',
      method: 'post',
      data: drink
    })
  },
  /**
  * 分页查询
  */
  finds(queryParam) {
    return request({
      url: '/platformModel/drink/finds',
      method: 'get',
      params: {
        'pageNum': queryParam.pageNum,
        'pageSize': queryParam.pageSize,
        'sortBy': queryParam.sortBy,
        'sortOrder': queryParam.sortOrder,
        'q': queryParam.q
      }
    })
  },
  findOptions(queryParam) {
    return request({
      url: '/platformModel/drink/find',
      method: 'get',
      params: {
        'sortBy': queryParam.sortBy,
        'sortOrder': queryParam.sortOrder,
        'q': queryParam.q
      }
    })
  },
  /**
  * 查看【饮品】详情
  */
  get(id) {
    return request({
      url: '/platformModel/drink/get',
      method: 'get',
      params: {
        'id': id
      }
    })
  },

  /**
  * 删除单个【饮品】
  */
  del(id) {
    return request({
      url: '/platformModel/drink/delete',
      method: 'post',
      params: {
        'id': id
      }
    })
  },

  /**
  * 批量删除【饮品】
  */
  deleteBatch(ids) {
    return request({
      url: '/platformModel/drink/deleteBatch',
      method: 'post',
      data: ids
    })
  },



  /**
   * 导出excel
   *
   * @param queryParam
   */
  exportExcel(queryParam) {
    return request({
      url: '/platformModel/drink/exportExcel',
      method: 'get',
      responseType: 'blob',
      params: {
        'pageNum': queryParam.pageNum,
        'pageSize': queryParam.pageSize,
        'sortBy': queryParam.sortBy,
        'sortOrder': queryParam.sortOrder,
        'q': queryParam.q
      }
    })
  },
  /**
   * 导出excel
   *
   * @param queryParam
   */
  exportExcelAll(queryParam) {
    return request({
      url: '/platformModel/drink/exportExcelAll',
      method: 'get',
      responseType: 'blob',
      params: {
        'pageNum': queryParam.pageNum,
        'pageSize': queryParam.pageSize,
        'sortBy': queryParam.sortBy,
        'sortOrder': queryParam.sortOrder,
        'total': queryParam.total,
        'q': queryParam.q
      }
    })
  },
  importExcel(fileInfo){
    return request({
      url: '/platformModel/drink/importExcel',
      method: 'post',
      data: fileInfo
    })
  }


}

export default drinkApi
