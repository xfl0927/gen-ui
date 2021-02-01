<template>
  <div class="yrjc-tabs" v-if="formVisible">
    <el-dialog
      v-el-drag-dialog
      v-loading="dialogLoading"
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="formVisible"
      :width="width"
      @cancel="cancel"
    >
      <div class="content">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in filterTabs"
            :key="item.id"
            :label="item.label"
            :name="item.name"
          >
            <div v-if="item.name === 'detail'">
              <el-form
                :model="form"
                label-position="right"
                label-width="100px"
                class="demo-form-inline"
              >
                  <el-form-item v-for="detail in detailsList" :key="detail.label" :label="detail.label">
                    <el-input
                      v-model.trim="detail.value"
                      disabled
                    />
                  </el-form-item>
              </el-form>
            </div>
            <div v-if="item.name === 'form' && isShowWorkflowForm">
              <div v-for="item in formList" :key="item.id">
                <div v-if="item.type==='default'" v-for="item in formList" :key="item.id">
                  <el-form ref="dataForm" :model="item"
                           label-position="left" size="small"
                           label-width="100px" style="width: 400px; margin-left:50px;">
                    <div v-for="taskForm in item.formProperties" :key="taskForm.id">
                      <el-form-item :label="taskForm.name">
                        <el-input v-model="taskForm.value"/>
                      </el-form-item>
                    </div>
                    <el-form-item :label="'意见'">
                      <el-input type="textarea" :rows="2" v-model="item.comment"/>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer" style="text-align: right">
                    <el-button type="primary" @click="handleSubmit(0)">通过</el-button>
                    <el-button type="primary" @click="rollback(item.id)">退回</el-button>
                  </div>
                </div>
                <div v-if="item.type==='approved'" v-for="item in formList" :key="item.id">
                  <el-form
                    ref="dataForm" :model="item"
                    label-position="left" size="small"
                    label-width="100px" style="width: 400px; margin-left:50px;">
                    <el-form-item :label="'意见'">
                      <el-input type="textarea" :rows="2" v-model="item.comment"/>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer" style="text-align: right">
                    <el-button type="primary" @click="handleSubmit(0)">通过</el-button>
                    <el-button type="primary" @click="handleSubmit(1)">不通过</el-button>
                    <el-button type="primary" @click="handleSubmit(2)">驳回</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="item.name === 'flowChartXml'" style="overflow: auto">
              <div v-html="flowChartXml">
                {{ flowChartXml }}
              </div>
            </div>
            <div v-if="item.name === 'history'">
              <history :list="list" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="large" type="primary" @click="cancel">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import history from '@/components/Tabs/history'
import request from '@/utils/request'
import { getAccessToken } from "@/utils/auth"
export default {
  name: 'YrjcTabs',
  directives: { elDragDialog },
  components: {
    history
  },
  props: {
    title: {
      type: String,
      default: '流程'
    },
    width: {
      type: String,
      default: '80%'
    }
    // params: {
    //   type: Object,
    //   default: () => {}
    // }
  },
  data() {
    return {
      tableHeight: -1,
      form: {},
      form1: {},
      params: {},
      list: [],
      formList: [],
      completeList: [],
      // tab1 列表
      detailsList: [],
      formVisible: false,
      dialogLoading: false,
      tabs: [
        {
          id: '1',
          label: '详情',
          name: 'detail'
        },
        {
          id: '2',
          label: '表单',
          name: 'form'
        },
        {
          id: '3',
          label: '流程图',
          name: 'flowChartXml'
        },
        {
          id: '4',
          label: '执行记录',
          name: 'history'
        }
      ],
      activeName: 'detail',
      flowChartXml: '',
      isShowWorkflowForm: false,
      workflowTest: {},
      filterTabs: [],
      complete:{
        taskId:"",
        payloadType:"CompleteTaskPayload",
        variables:{
          workflowPrefix_param:{},
          workflowPrefix_comment:""
        }
      }
    }
  },
  // watch: {
  //   params: {
  //     handler(val) {
  //       this.$set(this, 'params', val)
  //       this.getDetails()
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    handleClick(tab, event) {
      /**
       * 详情
       */
      if (tab.name === 'detail') {
        this.getDetails()
      /**
       * 流程
       */
      } else if (tab.name === 'form') {
        this.getTask()
      /**
       * 流程图
       */
      } else if (tab.name === 'flowChartXml') {
        this.getModel()
      /**
       * 执行记录
       */
      } else if (tab.name === 'history') {
        // 执行记录
        this.historyTasksFn(this.params).then(resp => {
          this.list = resp.data
        })
      }
    },
    cancel() {
      this.formVisible = false
    },
    showFn(row, params) {
      this.workflowTest = row
      this.params = params
      this.getTask()
      this.getDetails()
      this.getModel()
      this.formVisible = true
    },
    /**
     * 编辑完成 提交/通过/不通过/驳回 按钮
     * @params type 操作类型 0/通过 1/不通过 2/驳回
     * @params id taskId
     */
    handleSubmit(type) {
      this.dialogLoading = true
      this.formList.forEach(item => {

        // 任务ID
        this.complete['taskId'] = item.id

        // 修改的数据ID
        this.complete.variables['workflowPrefix_param']['id'] = this.workflowTest.id

        // 遍历任务
        item.formProperties.forEach(taskForm => {
          this.complete.variables['workflowPrefix_param'][taskForm.id] = taskForm.value
        })
        // 给每个任务赋值 意见或描述
        this.complete.variables['workflowPrefix_comment'] = item.comment

        // 回传token
        this.complete.variables['workflowPrefix_token'] = 'Bearer ' + getAccessToken()
        //
        this.complete.variables['workflowPrefix_id'] = this.workflowTest.id

        // this.completeList.push(this.complete)
      })

      this.completeFn(this.complete, this.complete.taskId, type).then( res => {
        if (res.code === '000000') {
          this.$message({
            type: 'success',
            message: '任务完成成功'
          })
          this.getTask()
          this.getModel()
          this.activeName = 'flowChartXml'
          this.dialogLoading = false
          // 刷新列表
          this.$emit('doQueryList', res.data)
        } else {
          this.$message({
            type: 'error',
            message: '任务完成失败'
          })
          this.dialogLoading = false
        }
      }).catch(() => {
        this.dialogLoading = false
      })
      this.completeList = []
    },
    /**
     * 退回
     */
    rollback(taskId) {
      this.$common.confirm('确定退回 ').then(() => {
          this.dialogLoading = true
          this.rollbackFn(taskId).then(res=> {
            if(res.code === '000000') {
              this.$message({
                type: 'success',
                message: '退回成功!'
              })
              this.dialogLoading = false
              this.formVisible = false
              this.$emit('doQueryList', res.data)
            }else{
              this.$message({
                type: 'error',
                message: '退回失败!'
              })
              this.dialogLoading = false
            }
          }).catch(() => {
            this.dialogLoading = false
          })
        })
    },
    /**
     * 获取详情
     */
    getDetails(){
      // 详情
      this.variablesFn(this.params).then(resp => {
        this.detailsList = []
        let entityVO = resp.data.workflowPrefix_form
        let showForm = resp.data.workflowPrefix_showForm
        for (let item of showForm) {
          this.detailsList.push({ 'label': item.name, 'value': entityVO[item.id] })
        }
      })
    },
    /**
     * 获取任务表单
     */
    getTask(){
      // 表单
      this.tasksFn(this.params).then(resp => {
          if(resp.code === '000000') {
            this.formList = resp.data
            if (this.formList.length === 0) {
              this.isShowWorkflowForm = false
              this.filterTabs = this.tabs.filter(item => item.id !== '2')
            } else {
              this.isShowWorkflowForm = true
              this.filterTabs = this.tabs
            }
          } else if (resp.code === '222222') {
            this.isShowWorkflowForm = false
            this.filterTabs = this.tabs.filter(item => item.id !== '2')
          }
      })
    },
    /**
     * 流程图
     */
    getModel(){
      // 流程图
      this.modelFn(this.params).then(resp => {
        this.flowChartXml = resp
      })
    },
    /**
     * 详情
     * */
    variablesFn(params) {
      return request({
        url: `/activiti/process/instance/${params.businessKey}/variables/${params['variable-name']}`,
        method: 'get',
        params
      })
    },
    /**
     * 表单
     * @params type： 任务类型  default: 普通任务  formPro 生成表单 + 意见框
     *                       approved: 审批    意见框
     * */
    tasksFn(params) {
      return request({
        url: `/activiti/process/instance/${params.businessKey}/tasks`,
        method: 'get'
      })
    },
    /**
     * 流程图
     */
    modelFn(params) {
      return request({
        url: `/activiti/process/instance/${params.businessKey}/model`,
        method: 'get'
      })
    },
    /**
     * 历史记录
     * */
    historyTasksFn(params) {
      return request({
        url: `/activiti/process/instance/history/${params.businessKey}/tasks`,
        method: 'get'
      })
    },
    /**
     *
     * 完成任务
     * @params taskId 当前提交任务的 taskId
     * @params type: 提交类型
     * */
    completeFn(params, taskId, type) {
      return request({
        url: `/activiti/tasks/${taskId}/${type}/complete`,
        method: 'post',
        data: params
      })
    },
    /**
     *
     * 任务回退
     * */
    rollbackFn(taskId) {
      return request({
        url: `/activiti/tasks/${taskId}/rollback`,
        method: 'post'
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.yrjc-tabs {
  .el-button-submit {
    text-align: right;
  }
}

</style>

