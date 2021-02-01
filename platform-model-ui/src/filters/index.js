
// 将UTC时间转化为北京时间
export function utoTimeToBeijing(value) {
    if(value!=null){
        return new Date(+new Date(new Date(value).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    }
    return null
}

// 将UTC时间转换为年月日
export function utoDateToBeijing(value) {
    if(value!=null){
        let date1 = new Date(value).toJSON();
        let date = new Date(+new Date(date1)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        return date.substr(0,10); //接取2020-04-02
    }
    return null;
}


// 数据字典取值
export function findEnumLabel(code, enums) {
    if(code!=null){
      let codeSrc = code.toString()
      // 多选枚举字典
      if(codeSrc.indexOf(',') > 0){
        let array = codeSrc.split(',')
        let src = "";
        for(let i = 0; i < array.length; i++){
            for (const key in enums) {
              const item = enums[key]
              if (item.value === array[i]) {
                if(i === 0) {
                  src += item.name
                } else {
                  src += ','+ item.name
                }
              }
            }
          }
        return src
      } else {
        // 单选枚举字典
        for (const key in enums) {
          const item = enums[key]
          if (item.value === codeSrc) {
            return item.name
          }
        }
      }
    }
    return ''
}

/**
 * 根据外键，返回其指定的属性数据
 *
 * @param id 该外键id
 * @param ary 该外键数组集合
 * @param attribute 该展示列 需返回属性
 */
export function  findForeignKey(id, ary, attribute) {
  let newObj = ary.find(item => item.id === id)
  if(newObj != null){
      return newObj[''+attribute]
  }

  return null
}
