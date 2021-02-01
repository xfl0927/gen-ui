<template>
  <div class="Element-Icons-container">
    <el-input
      v-model.trim="searchText"
      :clearable="true"
      placeholder="搜索 比如 'plus'"
      prefix-icon="el-icon-search"
    />
    <div class="element-icons-list">

      <div v-if="!searchMode" class="d2-icon-select--group">
        <el-row class="d2-icon-select--class-row">
          <el-col v-for="(iconName, iconIndex) in icon" :key="iconIndex" class="d2-icon-select--class-col" :span="6" @click.native="selectIcon('el-icon-'+iconName)">
            <i :class="'el-icon-'+iconName" />
            <span>{{ 'el-icon-'+iconName }}</span>
          </el-col>
        </el-row>
      </div>

      <div v-if="searchMode" class="d2-icon-select--group">
        <el-row class="d2-icon-select--class-row">
          <el-col v-for="(iconName, iconIndex) in iconFilted" :key="iconIndex" class="d2-icon-select--class-col" :span="6" @click.native="selectIcon('el-icon-'+iconName)">
            <i :class="'el-icon-'+iconName" />
            <span>{{ 'el-icon-'+iconName }}</span>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import icon from './icons/data/element-icons'
export default {
  name: 'Element',
  directives: { elDragDialog },
  props: {
    // 值
    value: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      // 绑定弹出框
      pop: false,
      // 所有图标
      icon,
      innerStyle: { height: '200px' },
      // 搜索的文字
      searchText: '',
      // 不是搜索的时候显示的折叠面板绑定的展开数据
      collapseActive: [0]
    }
  },
  computed: {
    // 输入框上绑定的设置
    bind() {
      return {
        placeholder: this.placeholder,
        clearable: this.clearable,
        ...this.$attrs
      }
    },
    // 是否在搜索
    searchMode() {
      return !!this.searchText
    },
    // 过滤后的图标
    iconFilted() {
      return this.icon.filter(iconClass => iconClass.indexOf(this.searchText) > -1)
    }
  },
  methods: {
    selectIcon(iconName = '') {
      const obj = {
        iconName: iconName,
        IconType: 'Element'
      }
      this.$emit('handleSendIcon', obj)
      if (iconName && this.autoClose) {
        this.pop = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .custom{
      margin-top: 0vh;
      width: 1000px;
    }
    .element-icons-list{
      .d2-icon-select--class-row {
        height: 70vh;
        overflow-x: hidden;
        overflow-y: scroll;
        border-top: none;
        border-bottom: none;
          .d2-icon-select--class-col {
            cursor:pointer;
            line-height: 60px;
            text-align: center;
            color: #929396;
            font-size: 30px;
            transition: all .1s ease-out;
            &:hover {
              color: #1890ff;
              background-color: #fff;
              border-radius: 4px;
              font-size: 45px;
              box-shadow: inset 0px 0px 0px 1px;
            }
            span{
              display: block;
              font-size: 14px;
              width: 100%;
              height: 30px;
              line-height: 14px;
              text-align: center;
            }
          }
        }
    }
</style>
