
<template>
  <span>
    <el-dialog
      v-el-drag-dialog
      custom-class="custom"
      title="图标选择器"
      :visible.sync="pop"
      append-to-body
      top="5vh"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="Awesome-Iocns" name="Awesome">
          <div class="awesome-icons-container">
            <AwesomeIcons @handleSendIcon="handleSendIcon" />
          </div>
        </el-tab-pane>

        <el-tab-pane label="Element-Iocns" name="Element">
          <div class="element-icons-container">
            <ElementIcons @handleSendIcon="handleSendIcon" />
          </div>
        </el-tab-pane>

        <el-tab-pane label="Svg-Iocns" name="Svg">
          <div class="Svg-icons-container">
            <SvgIcons @handleSendIcon="handleSendIcon" />
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>
    <!-- 允许用户输入 -->
    <el-input
      v-if="userInput"
      v-model.trim="currentValue"
      v-bind="bind"
      clearable
      clear
      style="max-width: 100%"
      @input="clearFn"
    >
      <template v-if="currentValue" slot="prepend">
        <i v-if="currentValue.indexOf('el-icon')>-1 || currentValue.indexOf('fa fa-')>-1" :class="currentValue" />
        <svg-icon v-else :icon-class="''+currentValue" class-name="disabled" />
      </template>
      <el-button slot="append" @click="openSelect">
        <i class="fa fa-list" />
      </el-button>
    </el-input>
    <!-- 不允许用户输入 -->
    <el-button v-if="!userInput" @click="openSelect">
      <template v-if="currentValue">
        <i v-if="currentValue.indexOf('el-icon')>-1 || currentValue.indexOf('fa fa-')>-1" :class="currentValue" />
        <svg-icon v-else :icon-class="''+currentValue" class-name="disabled" />
      </template>
      {{ currentValue ? currentValue : placeholder }}
    </el-button>
  </span>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import AwesomeIcons from './Awesome'
import ElementIcons from './Element'
import SvgIcons from './Svg'
export default {
  name: 'IconSelectIndex',
  directives: { elDragDialog },
  components: {
    AwesomeIcons,
    ElementIcons,
    SvgIcons
  },
  props: {
    // 值
    value: {
      type: String,
      default: ''
    },
    // 是否允许用户输入
    userInput: {
      type: Boolean,
      default: true
    },
    // 占位符
    placeholder: {
      type: String,
      required: false,
      default: '请选择'
    },
    // 弹出界面的方向
    placement: {
      type: String,
      required: false,
      default: 'right'
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      required: false,
      default: true
    },
    // 是否在选择后自动关闭
    autoClose: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      pop: false,
      // 图标乐行
      activeName: 'Awesome',
      // 图标名称
      currentValue: '',
      // 图标类型
      iconType: 'Awesome'
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
  created() {
    this.currentValue = '' + (this.value || '')
    this.collapseActive = Array.from({ length: AwesomeIcons.length }, (v, k) => k)
  },
  methods: {
    openSelect() {
      // if (!this.userInput) return
      this.pop = true
    },
    handleSendIcon(obj) {
      this.currentValue = '' + obj.iconName
      this.iconType = this.activeName
      this.$emit('handlesetIconName', this.currentValue)
      this.pop = false
    },
    clearFn() {
      this.currentValue = ''
      this.$emit('handlesetIconName', this.currentValue)
    }
  }
}
</script>
