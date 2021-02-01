<template>
  <div class="app-container">
		<!-- 查询区 -->
    <div v-if="queryList && queryList.length > 0" class="filter-container queryBox">
			<div class="queryList" :style="{height: formHeight+'px'}">
				<el-form ref="listQueryForm" :inline="true" :model="queryVariable" class="demo-form-inline btnHeight"  >
					<!-- <div class="queryListOne">
					<el-form-item prop="ssd" label="测试">
						<el-input
							v-model="queryVariable['sdfs']"
						>

						</el-input>
					</el-form-item>
					<el-form-item prop="ssd" label="测试">
						<el-input
							v-model="queryVariable['sdfs']"
						>

						</el-input>
					</el-form-item>
					<el-form-item prop="ssd" label="测试">
						<el-input
							v-model="queryVariable['sdfs']"
						>

						</el-input>
					</el-form-item>
					<el-form-item prop="ssd" label="测试">
						<el-input
							v-model="queryVariable['sdfs']"
						>

						</el-input>
					</el-form-item>
					</div> -->
					<div class="queryListOne" v-for="(item,index) in queryList" :key="index">
						<el-form-item  v-if="item.editType == 'text'" :prop="item.prop" :label="item.label">
							<el-input
								v-model.trim="queryVariable[item.prop+item.queryType]"
								:placeholder="'请输入'+item.label"
								:clearable="true"
							/>
						</el-form-item>
						<el-form-item  v-if="item.editType == 'number'" :prop="item.prop" :label="item.label" >
							<el-input
								v-model.number.trim="queryVariable[item.prop+item.queryType]"
								type="number"
								:placeholder="'请输入'+item.label+',纯数字'"
								:clearable="true"
							/>
						</el-form-item>
						<el-form-item  v-if="item.editType == 'textarea'" :prop="item.prop" :label="item.label" >
							<el-input
								v-model.trim="queryVariable[item.prop+item.queryType]"
								type="textarea"
								placeholder="请输入内容"
								:clearable="true"
								:show-word-limit="true"
								:autosize="{ minRows: 3, maxRows: 5 }"
								:maxlength="100"
							/>
						</el-form-item>
						<el-form-item  v-if="item.editType == 'select' || item.editType == 'multi_select'" :prop="item.prop" :label="item.label">
							<el-select
								v-model="queryVariable[item.prop+item.queryType]"
								:multiple="item.editType == 'select' ? false : true"
								:clearable="true"
								:placeholder="'请选择'+item.label"
								:filterable="true"
							>
								<el-option
									v-for="item1 in item.options"
									:key="item1.id"
									:label="item1.label"
									:value="item1.value"
								/>
							</el-select>
						</el-form-item>
						<el-form-item  v-if="item.editType == 'time'" :prop="item.prop" :label="item.label">
							<el-time-picker
								v-model="queryVariable[item.prop+item.queryType]"
								:is-range="item.isRange"
								:placeholder="'请选择'+item.label"
								:start-placeholder="'请选择开始'+item.label"
								:end-placeholder="'请选择结束'+item.label"
								:editable="true"
								:clearable="true"
							/>
						</el-form-item>
						<el-form-item  v-if="item.editType == 'date' || item.editType == 'datetime'" :prop="item.prop" :label="item.label" >
							<el-date-picker
								v-model="queryVariable[item.prop+item.queryType]"
								:type="item.type"
								:placeholder="'请选择'+item.label"
								:start-placeholder="'请选择开始'+item.label"
								:end-placeholder="'请选择结束'+item.label"
								:editable="true"
								:clearable="true"
								:value-format="item.editType == 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
							/>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div :class="More?'queryBut':'queryBtn1'">
				<el-button class="filter-item" @click="handleSearch()" type="primary">查询</el-button>
      	<el-button class="filter-item" @click="handleReset()">重置</el-button>
      	<el-button v-if="More" @click="handleMore()" class="filter-item" >{{moreText}}</el-button>
			</div>
		</div>
		<!-- 按钮区 -->
		<div class="button-container btnBox filter-container">
			<template v-for="(item,index) in listBtnObj" >
				<el-button
					v-if="!item.isLine"
					class="filter-item"
					:key="index"
          :disabled="item.disabled"
					@click="btnAction(item.isTabCheck,item.action)"
				>
					<i :class="item.icon" />
					<span>{{item.label}}</span>
				</el-button>
			</template>
    </div>
		<!-- 表格区 -->
		<div @mouseenter="onMouseOver" @mouseleave="onMouseout" class="tableBox">
			<el-table
				:height="tableHeight"
				ref="filterTable"
				:data="listTable.tableData"
				v-loading="loading"
				border
				fit
				highlight-current-row
				style="width: 100%"
				@selection-change="selectionChange"
				row-key="id"
				:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
				@sort-change="sortChange"
			>
				<el-table-column v-if="listTable.isCheck" type="selection" width="50" align="center" />
				<template v-for="(item,index) in listTable.tableHeader" >
					<el-table-column
						:key="index"
						v-if="item.showed"
						:fixed="item.fixed == 'N'?false:(item.fixed == 'L'?'left':'right')"
						:prop="item.column"
						:label="item.name"
						header-align="center"
						align="center"
						:min-width="item.width"
						:sortable="item.ordered?'custom':false"
					>
						<template slot-scope="scope" slot="header">
							<span >{{item.name}}</span>
							<span v-if="item.filtered">
								<el-popover
									placement="bottom"
									trigger="click"
									:ref="`popover-${scope.$index}`"
									min-width="200"
									:popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }"
									>
									<i slot="reference"  @click.stop="filterIcon(scope.$index,item.column)" class="fa fa-filter iconTab"></i>
									<div>
										<span class="popName">{{item.name}}</span>
										<!-- 操作选择 -->
										<el-select v-model="tableHeaderVal[item.column]" value-key="value" @change="selChange(item.column,$event,scope.$index)" clearable placeholder="请选择操作选项">
											<el-option
												v-for="(item1,index) in item.filterValues"
												:key="index.value"
												:label="item1.label"
												:value="item1">
											</el-option>
										</el-select>
										<!-- 值 -->
										<span class="popVal" v-if="tableHeaderVal[item.column]">
											<template v-if="tableHeaderVal[item.column].editType == 'text'">
												<el-input
													class="popInput"
													v-model.trim="tabHeaderZiVal[item.column+tableHeaderVal[item.column].value]"
													:placeholder="'请输入'+item.name"
													:clearable="true"
												/>
											</template>
											<template v-if="tableHeaderVal[item.column].editType == 'number'">
												<el-input
													class="popInput"
													v-model.number.trim="tabHeaderZiVal[item.column+tableHeaderVal[item.column].value]"
													type="number"
													:placeholder="'请输入'+item.name+',纯数字'"
													:clearable="true"
												/>
											</template>
											<template v-if="tableHeaderVal[item.column].editType == 'select' || tableHeaderVal[item.column].editType == 'multi_select'">
												<el-select
													v-model="tabHeaderZiVal[item.column+tableHeaderVal[item.column].value]"
													:multiple="tableHeaderVal[item.column].editType == 'select' ? false : true"
													:clearable="true"
													:placeholder="'请选择'+item.name"
													:filterable="true"
												>
													<el-option
														v-for="item2 in tableHeaderVal[item.column].options"
														:key="item2.id"
														:label="item2.label"
														:value="item2.value"
													/>
												</el-select>
											</template>
											<template v-if="tableHeaderVal[item.column].editType == 'time'">
												<el-time-picker
													v-model="tabHeaderZiVal[item.column+tableHeaderVal[item.column].value]"
													:is-range="tableHeaderVal[item.column].isRange"
													:placeholder="'请选择'+item.name"
													:start-placeholder="'请选择开始'+item.name"
													:end-placeholder="'请选择结束'+item.name"
													:editable="true"
													:clearable="true"
												/>
											</template>

											<template v-if="tableHeaderVal[item.column].editType =='date' || tableHeaderVal[item.column].editType =='datetime'">
												<el-date-picker
													v-model="tabHeaderZiVal[item.column+tableHeaderVal[item.column].value]"
													:type="tableHeaderVal[item.column].type"
													:placeholder="'请选择'+item.name"
													:start-placeholder="'请选择开始'+item.name"
													:end-placeholder="'请选择结束'+item.name"
													:editable="true"
													:clearable="true"
													:value-format="tableHeaderVal[item.column].editType =='date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
												/>
											</template>
										</span>
										<div class="popBottom">
											<el-button size="mini" type="default" @click="cancelPop(scope.$index)">取消</el-button>
    									<el-button type="primary" size="mini" @click="dateminePop(scope.$index,item,tableHeaderVal[item.column],tabHeaderZiVal[item.column+tableHeaderVal[item.column].value])">确定</el-button>
										</div>
									</div>
								</el-popover>
							</span>
						</template>
						<template slot-scope="scope">
							<div v-if="item.webFilter" class="rowMain">{{scope.row[item.column] | item.webFilter(item.webFilterArr,item.webFilterProp)}}</div>
							<div v-else class="rowMain">{{scope.row[item.column]}}</div>
						</template>
					</el-table-column>
				</template>
				<af-table-column
					v-if="listTable.isTableBtn"
					fixed="right"
					label="操作"
					prop="operation"
					align="center"
				>
					<template slot-scope="scope">
						<div class="elLink">
							<el-link
								class="elLinkBox"
								v-for="(item1,index) in scope.row.operation"
								:key="index"
								:icon="item1.icon"
								:underline="false"
								:type="item1.type"
								:disabled="item1.disabled"
								@click="tableLineAction(scope.row,item1.action)"
							>{{item1.label}}</el-link>
						</div>
					</template>
				</af-table-column>
			</el-table>
			<div class="rightFloat">
				<i v-show="setTabShow" @click="turnDrag()" class="el-icon-setting rightFloatIcon"></i>
				<!-- 右侧浮动内容 -->
				<div v-show="drags" class="rightFloatBox">
					<div class="itxst">
						<div class="col">
							<draggable v-model="tableHeaders"  handle=".mover"  animation="300" @start="onStart" @end="onEnd">
								<transition-group>
										<div class="item" v-for="(item,index) in tableHeaders" :index="index" :key="item.seqNum">
											<el-checkbox v-model="item.showed" label="显示" size="small"></el-checkbox>
											<el-radio v-model="item.fixed" label="N">不固定</el-radio>
  										<el-radio v-model="item.fixed" label="L">左固定</el-radio>
  										<el-radio v-model="item.fixed" label="R">右固定</el-radio>
											<span class="titHeader">{{item.name}}</span>
											<span class="mover"><i class="el-icon-rank"></i></span>
										</div>
								</transition-group>
							</draggable>
							<div class="butBox">
								<el-button @click="cancelBtn()" size="mini" plain >取消</el-button>
								<el-button @click="datemineBtn()" size="mini" type="success">确定</el-button>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
		<!-- 分页区 -->
		<div v-if="listTable.showPage && total" class="pagination-container">
      <el-pagination
				ref="tablePage"
        :current-page.sync="pageParam.pageNum"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="pageParam.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 15px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>

</template>
<script>
import draggable from 'vuedraggable'

export default {
	name: 'DynTable',
	components:{draggable},
	props:{
		eventName: {
			type: Object,
      require: true,
      default() {
        return {}
      }
		},
		listBtnObj: {
      type: Array,
      default: ()=>[]
    },
		listTable: {
			type: Object,
      require: true,
      default() {
        return {
					total:null,
					showPage:false,
					isCheck:false,
					isTableBtn:false,
					tableData: [],
					tableHeader: []
        }
      }
		}


	},
  data() {
    return {
			queryList: [],
			hideText:false,
			moreText:"更多",
			formHeight: null,
			heightQuery: null,
			screenWidth: document.body.clientWidth,
			timer: false,
			More: false,
			drags:false,
			loading:false,
			tableHeaders:[],
			checkTabs:[],
			queryVariable:{},
			isActIndex:0,
			tableHeaderVal:{},
			tabHeaderZiVal:{},
			setTabShow:false,
			tableHeight: -1,
			total:this.listTable.total?this.listTable.total:0,
			pageParam: {
        pageNum: 1,
        pageSize: 20,
        sortBy: 'id',
        sortOrder: 'desc',
        q: ''
      },

    }
  },
  created() {
		this.tableHeaders = JSON.parse(JSON.stringify(this.listTable.tableHeader));
	},
	mounted(){
		this.initHeight()
		this.resizeInitFn()
		this.getListQuerys();
	},
	watch: {

	},
  methods: {
		resizeInitFn() {
			window.addEventListener("resize", this.initHeight, false);
		},
		//初始化form查询区高度
		initHeight(){
			this.$nextTick(()=>{
				if(this.queryList && this.queryList.length > 0){
					let hei = document.querySelector('.btnHeight').offsetHeight;
					if(this.moreText == '收起'){
							this.formHeight = hei;
						}else if(this.moreText == '更多'){
							this.formHeight = 39;
						}
					if(hei > 39){
						this.More = true;
					}else{
						this.More = false;
						this.moreText = "更多"
						this.hideText = false;
					}
				}
			this.resizeHeight()
			})
		},
		//把表格的头部中有filter的摘取出来赋值给查询区
		getListQuerys(){
			this.queryList = [];
			// console.log('=========')
			// console.log(this.listTable)
			this.listTable.tableHeader.forEach((item,index)=>{
				if(item.showed && item.filtered){
					this.queryList.push(JSON.parse(JSON.stringify(item.filterQuery)))
				}
			})
		},
		//table高度计算
		resizeHeight() {
      this.$nextTick(()=>{
				const otherNum = (this.listTable.showPage && this.total) ? 40 : 20;
				this.tableHeight = this.getOffsetTop({
					self: this,
					otherNumber: otherNum,
					refTable: 'filterTable',
					refPage: 'tablePage'
				})
			})
    },
    resize() {
      this.resizeHeight()
      window.addEventListener('resize', this.resizeHeight, false)
    },
    removeResize() {
      window.removeEventListener('resize', this.resizeHeight, false)
    },
		//查询方法
    handleSearch(){
			console.log(this.queryVariable)
			this.$parent[this.eventName.search](this.queryVariable)
		},
		//重置方法
		handleReset(){
			this.queryVariable = {};
			this.$parent[this.eventName.reset]()
		},
		//更多方法
		handleMore(){
			if(this.hideText){
				this.formHeight = 39;
			}else{
				this.formHeight = document.querySelector('.btnHeight').offsetHeight;
			}

			this.hideText = !this.hideText
			this.moreText = this.hideText==true?'收起':'更多'
			this.initHeight()
		},
		//鼠标进入table显示操作按钮
		onMouseOver(){
			this.setTabShow = true;
		},
		//鼠标离开table隐藏操作按钮
		onMouseout(){
			this.setTabShow = false;
		},
		//按钮区点击事件
		btnAction(tabCheck,btnActs){
			if(tabCheck && this.checkTabs.length == 0){
				this.$message({
          showClose: true,
          message: '请选择表格内容',
          type: 'warning'
				});
			}else{
				if(tabCheck){
					this.$parent[btnActs](this.checkTabs)
				}else{
					this.$parent[btnActs]()//新增
				}

			}
		},
		//table中操作列的点击事件
		tableLineAction(row,lineActs){
			this.$parent[lineActs](row)
		},
		// 记录选中行
    selectionChange(val) {
			console.log(val)
			this.checkTabs = val;
		},
		//点击表头的筛选按钮
		filterIcon(index,column){
			this.tableHeaderVal = {};
			this.tabHeaderZiVal = {};
			document.body.click();
		},
		//点击表格排序
		sortChange(column){
			console.log(column)
			const orderObj = {
				name: column.prop,
				order: column.order
			}
			this.$parent[this.eventName.order](orderObj)
		},
		//表头筛选项里的取消
		cancelPop(index){
			this.$refs[`popover-`+index][0].doClose();
			this.$refs[`popover-`+index][1].doClose();
			// this.$refs[`popover-`+index][2].doClose();
			console.log(this.$refs[`popover-`+index])
		},
		//表头筛选项里的确定按钮
		dateminePop(index,items,queryTypeObj,queryTypeVal){
			// console.log(this.$refs[`popover-`+index])
			if(queryTypeObj){
				if(queryTypeVal){
					this.queryVariable[items.column+queryTypeObj.value] = queryTypeVal;
					this.$parent[this.eventName.search](this.queryVariable)
					this.queryList.map(item=>{
						if(item.prop == items.column){
							item.queryType = queryTypeObj.value;
						}
						return item
					})
					this.$refs[`popover-`+index][0].doClose();
					this.$refs[`popover-`+index][1].doClose();
					// this.$refs[`popover-`+index][2].doClose();
				}else{
					this.$message({
						showClose: true,
						message: items.name+"的值不能为空",
						type: 'warning'
					});
				}
			}else{
				this.$message({
          showClose: true,
          message: '请选择操作选项',
          type: 'warning'
				});
			}
		},
		//表头中select的操作选择
		selChange(ids,val,index){
			console.log(this.tableHeaderVal)
		},
		//点击设置按钮显示拖拽区
		turnDrag(){
			this.tableHeaders = JSON.parse(JSON.stringify(this.listTable.tableHeader));
			this.drags = !this.drags;
		},
		//点击拖拽区的确定按钮
		datemineBtn(){
			// console.log(this.tableHeaders)
			// this.$emit('initTable',this.queryVariable)
			this.$parent[this.eventName.search](this.queryVariable)
			this.drags = false;
			this.getListQuerys();
			this.initHeight();
		},
		//点击拖拽区的取消按钮
		cancelBtn(){
			this.tableHeaders = JSON.parse(JSON.stringify(this.listTable.tableHeader));
			this.drags = false;
		},
		//开始拖拽事件
    onStart(){
      this.drag = true;
    },
    //拖拽结束事件
    onEnd() {
		 this.drag = false;
		},
		handleSizeChange(val) {
			this.pageParam.pageSize = val;
			// this.$emit('initTable')

    },
    handleCurrentChange(val) {
			this.pageParam.pageNum = val;
			// this.$emit('initTable')
    },
		/**
		 * 计算表格总体高度
		 * @param obj
		 *   dom: 当前元素距离视口绝对高度
		 *   pagination： 分页容器高度
		 *   marginTop:分页容器marginTop
		 *   otherNumber: 其他高度值之和
		 *   refTable: table的ref值
		 *   refPage: page的ref值
		 *
		 * @returns {number}
		 */
		getOffsetTop(obj){
			const self = obj.self
			const refTable = obj.refTable
			const refPage = obj.refPage
			let pagination = null
			if (self.$refs[refPage]) {
				pagination = self.$refs[refPage].$el
				pagination.style.display = 'block'
			}
			const clientHeight = document.documentElement.clientHeight
			const marginTop = obj.marginTop || 5
			const otherNumber = obj.otherNumber || 0
			const otherHeightSum = pagination ? pagination.clientHeight + otherNumber : marginTop + otherNumber
			if (!self.$refs[refTable]) {
				return 0
			}
			let table = self.$refs[refTable].$el
			let iTop = table.offsetTop
			while (table.offsetParent) {
				table = table.offsetParent
				iTop += table.offsetTop
			}
			const height = clientHeight - (iTop + otherHeightSum)
			return height
		}

  }
}
</script>
<style lang="scss" scoped>
	@import '../../styles/common';
	.queryBox{
		display: flex;
		margin-bottom: 10px;
		.queryList{
			height: 39px;
			flex: 1;
			.queryListOne{
				display: inline-block;
				padding-right: 15px;
				.el-form-item--mini.el-form-item{
					margin-bottom: 10px !important;
				}
			}
			.hideText{
				height: 39px;
    		overflow: hidden;
			}
		}
		.queryBut{
      width: 200px;
		}
		.queryBtn1{
			width:125px;
		}
	}
	.btnBox{
		margin: 0 0 10px 0
	}
	.tableBox{
		position: relative;
		.rowMain{
			display:inline-block
		}
		.elLink{
			white-space: nowrap;
			.elLinkBox{
				padding: 0 5px;
			}
		}

	}
	.popName{
		padding-right:10px;
	}
	.popVal{
		padding-left:10px;
		.popInput{
			width:200px;

		}
	}

	.popBottom{
		text-align: center;
		padding:10px 10px 0 10px;
	}
	.iconTab{
		margin-left: 5px;
		cursor: pointer;
	}
	.rightFloat{
		position:absolute;
		right:0;
		top: 0;
		z-index: 8;
		.rightFloatIcon{
			float: right;
			width: 48px;
			height: 48px;
			text-align: center;
			line-height: 48px;
			background: #fff;
			border: 1px solid #dfe6ec;
			cursor: pointer;
		}
		.rightFloatBox{
			margin-top:48px;
			background: #fff;
			.titHeader{
				padding:0 10px;
			}
			.butBox{
				text-align: center;
				padding-top:10px;
			}
		}
	}

	.itxst {
    padding: 10px;
    border: 1px solid #dfe6ec;
  }
  .item {
    padding: 6px 12px;
    border: solid 1px #eee;
    background-color: #f1f1f1;
    text-align: left;
  }
  .item + .item {
    border-top: none;
    margin-top: 6px;
  }
  .mover {
    background-color: #fdfdfd;
		cursor: move;
		float:right;
	}
	.el-checkbox {
    margin-right: 10px !important;
	}
	.el-radio {
    margin-right: 10px !important;
	}

</style>

