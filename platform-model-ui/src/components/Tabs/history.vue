<template>

  <div class="history-table table-container">
    <el-table
      ref="el-table"
      :data="list"
      highlight-current-row
      border
      stripe
      size="mini"
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        width="65"
        fixed="left"
        align="center"
        label="序号"
      />
      <el-table-column
        label="任务名称"
        prop="name"
        width="200"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="row.type === 'default'">普通任务</span>
          <span v-else-if="row.type === 'approved'">审批</span>
          <span v-else >提交</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作人"
        prop="owner"
        width="100"
        align="center"
      />
      <el-table-column
        label="操作类型"
        prop="operation"
        width="200"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="row.operation === 'submit'">提交</span>
          <span v-if="row.operation === 'pass'">通过</span>
          <span v-if="row.operation === 'reject'">驳回</span>
          <span v-if="row.operation === 'noPass'">不通过</span>
          <span v-if="row.operation === 'rollback'">退回</span>
        </template>
      </el-table-column>
      <el-table-column
        label="起始时间"
        prop="startTime"
        width="200"
        align="center"
      />
      <el-table-column
        label="结束时间"
        prop="endTime"
        imn-width="200"
        align="center"
      />
      <el-table-column
        label="评论"
        prop="comment"
        fixed="right"
        width="80"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.comment && row.comment[1] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'HistoryTable',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleShowTaskForm(id) {
    }
  }
}
</script>
