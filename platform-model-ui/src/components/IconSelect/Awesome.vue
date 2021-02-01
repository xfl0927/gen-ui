<template>
  <div class="Awesome-Icons-container">
    <el-input
      v-model.trim="searchText"
      :clearable="true"
      placeholder="搜索 比如 'plus'"
      prefix-icon="el-icon-search"
    />
    <el-collapse v-if="!searchMode" v-model="collapseActive" class="d2-icon-select--group">
      <el-collapse-item v-for="(item, index) in icon" :key="index" :title="item.title" :name="index" class="d2-icon-select--class">
        <el-row class="d2-icon-select--class-row">
          <el-col v-for="(iconName, iconIndex) in item.icon" :key="iconIndex" class="d2-icon-select--class-col" :span="6" @click.native="selectIcon('fa '+iconName)">
            <i :class="'fa ' + iconName" />
            <span>{{ iconName }}</span>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <div v-if="searchMode" class="d2-icon-select--group">
      <div v-for="(item, index) in iconFilted" :key="index" class="d2-icon-select--class">
        <div class="d2-icon-select--class-title">{{ item.title }}</div>
        <el-row class="d2-icon-select--class-row">
          <el-col v-for="(iconName, iconIndex) in item.icon" :key="iconIndex" class="d2-icon-select--class-col" :span="6" @click.native="selectIcon('fa '+iconName)">
            <i :class="'fa ' + iconName" />
            <span>{{ iconName }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import icon from './icons/data/awesome-icons'
export default {
  name: 'Awesome',
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
      return this.icon.map(iconClass => ({
        title: iconClass.title,
        icon: iconClass.icon.filter(icon => icon.indexOf(this.searchText) >= 0)
      })).filter(iconClass => iconClass.icon.length > 0)
    }
  },
  methods: {
    selectIcon(iconName = '') {
      const obj = {
        iconName: iconName,
        IconType: 'Awesome'
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
    .d2-icon-select--group {
      height: 70vh;
      overflow-x: hidden;
      overflow-y: scroll;
      border-top: none;
      border-bottom: none;
      .d2-icon-select--class {
        .d2-icon-select--class-title {
          line-height: 30px;
          text-align: center;
          background-color: #ffffff;
          border-radius: 4px;
          margin: 10px 0px;
        }

        .d2-icon-select--class-row {
          .d2-icon-select--class-col {
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
    }
</style>
