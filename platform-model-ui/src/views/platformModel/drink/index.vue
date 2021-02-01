<template>
  <div class="app-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
    </el-form>
</div>
<div class="button-container">
      <el-button type="primary"  @click="handleCreate"><i class="el-btn-icon-show el-icon-plus" /> 新增</el-button>
      <el-button @click="handleDeleteBatch"><i class="el-btn-icon-show el-icon-delete" /> 批量删除</el-button>
      <el-button @click="exportExcel"><i class="el-btn-icon-show el-icon-download" /> 导出当前页</el-button>
      <el-button @click="exportAllExcel"><i class="el-btn-icon-show  el-icon-download" /> 导出全部</el-button>
     <el-button>
        <label class="export-excel" for="el-upload"><i class="el-btn-icon-show  el-icon-upload2" /> 导入Excel</label>
        <el-upload
          v-show="false"
          class="filter-item"
          ref="uploadFile"
          action=""
          :on-change="importExcel"
          :show-file-list="false"
          accept=".xlw,.xls,.xlsx"
          :auto-upload="false">
          <el-button slot="trigger" id="el-upload" class="filter-item" icon="el-icon-upload2">导入Excel</el-button>
        </el-upload>
      </el-button>
</div>
<div class="table-container">
    <el-table  :data="list" highlight-current-row
              @selection-change="selectionChange"
              @sort-change="sortChange"
              :height="tableHeight"
              ref="el-table"
              border stripe style="width: 100%;">
      <el-table-column type="selection"  
                       width="50" />
      <el-table-column
            type="index"
            width="65"
            fixed="left"
            align="center"
            label="序号"/>
      <el-table-column label="名称"
                       prop="drinkName"
                       
                       align="center">
        <template slot-scope="{row}">
          <span>{{ row.drinkName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人"
                       prop="createName"
                       
                       align="center">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间"
                       prop="createTime"
                       
                       sortable="custom"
                       align="center">
        <template slot-scope="{row}">
         <span>{{ row.createTime | utoTimeToBeijing }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人"
                       prop="modifyName"
                       
                       align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间"
                       prop="modifyTime"
                       
                       sortable="custom"
                       align="center">
        <template slot-scope="{row}">
         <span>{{ row.modifyTime | utoTimeToBeijing }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  fixed="right">
        <template slot-scope="{row}">
          <el-link class="padding-right-10" :underline="false" type="primary" @click="handleUpdate(row)">
            <i class="el-btn-icon-show el-icon-edit-outline" />编辑
          </el-link>
          <el-link class="padding-right-10" :underline="false" type="danger" @click="handleDeleteSingle(row)">
            <i class="el-btn-icon-show el-icon-delete" /> 删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>
</div>
    <pagination
       v-show="total>0"
       ref="el-pagination"
       :total="total"
       :page.sync="query.page"
       :limit.sync="query.limit"
       @pagination="doQueryList"/>
        <!-- 新建表单 -->
        <drink-add ref="drinkAdd"
                                @created="doQueryList({ page: 1 })"/>
        <!-- 编辑表单 -->
        <drink-edit ref="drinkEdit"
                                @updated="doQueryList({})"/>
  </div>
</template>

<script>
import drinkAdd from './add'
import drinkEdit from './edit'
import { getOffsetTop, queryToString } from '@/utils/public'
import drinkApi from '@/api/platformModel/drink'
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination'

export default {
  name: 'DrinkTable',
  directives: { elDragDialog },
  components: {
    Pagination,
    drinkAdd,
    drinkEdit
  },
  data() {
    return {
      // 组件内部调用的查询和重置方法
      eventName: {
        search: 'handleQuery',
        reset: 'handleReset'
      },
      // 动态表格属性
      dynTableData: {
        listBtnObj: [],
        listTable: {},
        inLineBtnList: []
      },
      listQuery: {},
      tableHeight: -1,
      likeArray: [
      ],
      list: [],
      total: 0,
      listLoading: true,
      query: {
        pageNum: 1,
        pageSize: 20,
        sortBy: 'id',
        sortOrder: 'desc',
        q: ''
      },
      selectItems: []
    }
  },
  mounted() {
    this.resize()
    this.doQueryList({ page: 1 })
  },
  destroyed() {
    this.removeResize()
  },
  methods: {
    /**
     * 选择框变化
     */
    selectionChange(val) {
      this.selectItems = val
    },
    /**
     * 触发后端排序
     */
    sortChange({ prop, order }) {
      const sortKeyMap = {
        'createTime': 'createTimeSortSign',
        'modifyTime': 'modifyTimeSortSign'
      }
      for (var k in sortKeyMap) {
        const sortKey = sortKeyMap[k]
        if (k !== prop) {
          this.query[sortKey] = null
        } else {
          if (order === 'ascending') {
            this.query[sortKey] = 1
          } else {
            this.query[sortKey] = -1
          }
        }
      }
      this.doQueryList({})
    },
    /**
     * 触发搜索操作
     */
    handleQuery() {
      this.doQueryList({ page: 1 })
    },
    // 重置按钮方法
    handleReset() {
      this.query = {
        pageNum: 1,
        pageSize: 20,
        sortBy: 'id',
        sortOrder: 'desc'
      }
      this.listQuery = {
        searchText: ''
      }
      this.doQueryList({ page: 1 })
    },
    /**
     * 操作下拉对应方法
     * @param command
     */
    handleCommand: function(command) {
      this[command.method](command.arg)
    },
    /**
     * 计算列表高度
     */
    resizeHeight() {
      this.tableHeight = getOffsetTop({
        self: this,
        otherNumber: 20
      })
    },
    resize() {
      this.resizeHeight()
      window.addEventListener('resize', this.resizeHeight, false)
    },
    removeResize() {
      window.removeEventListener('resize', this.resizeHeight, false)
    },
    /**
     * 执行列表查询
     */
    doQueryList({ page, limit }) {
      if (page) {
        this.query.pageNum = page
      }
      if (limit) {
        this.query.pageSize = limit
      }
      this.listLoading = true

      const args = Object.assign({}, this.query)
      args.q = queryToString(this.listQuery)
      this.listLoading = true
      return drinkApi.finds(args)
        .then(res => {
          this.list = res.data.list
          this.total = res.data.total
        })
        .finally(() => {
          this.listLoading = false
        })
    },

    /**
     * 删除单条记录
     */
    handleDeleteSingle(row) {
      return this.$common.confirm('是否确认删除')
        .then(() => {
          this.listLoading = true
          drinkApi.del(row.id)
          .then(() => {
                this.$common.showMsg('success', '删除成功')
                return this.doQueryList({ page: 1 })
          })
        })
        .catch(() => {
          this.$message({type: 'info',message: '已取消删除'})
        })
    },
    /**
     * 批量删除记录
     */
    handleDeleteBatch() {
      if (this.selectItems.length <= 0) {
        this.$common.showMsg('warning', '请选择饮品')
        return
      }
      return this.$common.confirm('是否确认删除')
        .then(() =>{
            this.listLoading = true
            drinkApi.deleteBatch(this.selectItems.map(row => row.id))
            .then(() => {
                this.$common.showMsg('success', '删除成功')
                return this.doQueryList({ page: 1 })
            }).catch(()=>{
                this.listLoading = false
            })
        }).catch(() => {
              this.$message({
              type: 'info',
              message: '已取消删除'
          })
        })
    },
    /**
     * 打开新建表单
     */
    handleCreate() {
      this.$refs.drinkAdd.handleCreate()
    },
    /**
     * 打开编辑表单
     */
    handleUpdate(row) {
      this.$refs.drinkEdit.handleUpdate(row)
    },
    exportExcel() {
      this.export()
    },
    exportAllExcel() {
      this.listLoading = true
      const args = Object.assign({}, this.query)
      args.total = this.total
      args.q = queryToString(this.listQuery)
      drinkApi.exportExcelAll(args).then(res=>{
        this.listLoading = false
        let link = document.createElement('a');
        let body = document.querySelector('body');
        link.href = window.URL.createObjectURL(res);
        link.download = "记录.xlsx";
        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
    },
    export(pageNum) {
      this.listLoading = true
      const args = Object.assign({}, this.query)
      args.q = queryToString(this.listQuery)
      if (pageNum) {
        args.pageNum = pageNum
      }
      drinkApi.exportExcel(args).then(res=>{
        this.listLoading = false
        let link = document.createElement('a');
        let body = document.querySelector('body');
        link.href = window.URL.createObjectURL(res);
        link.download = "记录（第" + args.pageNum + "页）.xlsx";
        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
    },
    importExcel(file){
      this.listLoading = true
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = (e) => {
        let excelFile = {}
        excelFile.base64Str = e.target.result
        drinkApi.importExcel(excelFile).then(res=>{
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '导入成功!'
            })
            this.doQueryList({ page: 1 })
          }else{
            this.$message({
              type: 'error',
              message: res.message
            })
            this.listLoading = false
          }
        }).catch(()=>{
          this.listLoading = false
        })
      }
    }
  }
}
</script>
