import { arrayToMap } from '@/utils/public'
import dictListApi from '@/api/develop/metaConsDetail'


const dictionary = {
  state: {
    dictList: [],
    startDict: {
      true: '启用',
      false: '停用'
    },
    booleanDict: {
      true: '是',
      false: '否'
    },
    genderDict: {
      1: '男',
      2: '女',
      3: '保密'
    }
  },
  mutations: {
    SET_DICT_LIST(state, args) {
      state.dictList = args
    }
  },
  actions: {
    GetDictList({ commit }, data) {
      return new Promise((resolve, reject) => {
        dictListApi.findAll().then(res => {
          commit('SET_DICT_LIST', arrayToMap(res.data, 'constCode'))
          resolve()
        }).catch(err => {
          reject("获取智能开发中心枚举值异常")
        })
      })
    }
  }
}

export default dictionary
